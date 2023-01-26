const express = require('express');
const router = express.Router();
const db = require('../models');
const ObjectID = require('mongoose').Types.ObjectId;
const ModelLib = require('../lib/modelLib');
const { signUpErrors } = require('../utils/errors.utils');
const { verifyToken } = require('./auth');

const ObjectID = require('mongoose').Types.ObjectId;

/**
 * 
 * @param {"create" | "read" | "update" | "delete"} crud 
 * @returns 
 */
function verifyCrud(crud) {
    return async (req, res, next) => {
        try {
            const user = req.user
            const CRUDModel = req.CRUDModel
            const crudOption = crud in CRUDModel.crudOptions ? CRUDModel.crudOptions[crud] : true
            let crudResponse
            if (req.user.accessRights?.includes[`${CRUDModel.name}:${crud}`]) {
                crudResponse = true
            }
            else if (typeof crudOption == "function") {
                crudResponse = await crudOption(user || undefined)
            } else {
                crudResponse = crudOption
            }
            if (!crudResponse)
                throw { status: 403, message: "User Not Authorized" };
            req.crudResponse = crudResponse
            return next()

        } catch (error) {
            return res.status(error.status || 500).send(error.message || "Server Internal Error")

        }
    }
}

function VerifyModel(req, res, next) {
    const Model = db[req.params.Model];
    if (!Model) {
        return res.status(process.env.RESPONSE_ERROR).send('unknown Model:', req.params.Model);
    }
    req.Model = Model;
    req.CRUDModel = Model;
    next();
};
function VerifyNAssociation(req, res, next) {
    const Model = req.Model;
    req.associationName = req.params.association
    req.association = Model.NAssociationsData[req.associationName]
    console.log(req.associationName)
    if (req.association) {
        req.options = ModelLib.GetNAssociationOptions(Model, req.associationName, req.instance)
        if (req.options) {
            console.log(req.options);
            req.AssociationModel = db[req.options.modelName];
            req.CRUDModel = req.AssociationModel;
            return next();
        }
    };
    return res.status(400).send('association is not valid')
};
function VerifyAssociation(req, res, next) {
    const Model = req.Model;
    req.associationName = req.params.association
    req.associationKey = req.associationName + '_id'
    req.association = Model.associationsData[req.associationKey]
    console.log(req.associationKey);
    if (req.association) {
        req.options = ModelLib.GetAssociationOptions(Model, req.associationName, req.instance)
        if (req.options) {
            req.AssociationModel = db[req.options.modelName];
            req.CRUDModel = req.AssociationModel;
            return next();
        }
    };
    return res.status(400).send('association is not valid')
};
router.post('/:Model/Create', VerifyModel, verifyToken, verifyCrud("create"), async function (req, res, next) {
    const Model = req.Model;
    try {
        const crudResponse = req.crudResponse
        let options = {}
        switch (crudResponse) {
            case true:
                break;
            case false:
                throw { status: 403, message: "User Not Authorized" };
                break;
            default:
                break;
        }
        const result = await ModelLib.CreateModel(Model, req.body.data);
        res.send(result);
    } catch (error) {
        console.error(error);
    }

});
router.get('/:Model/GetAllModels', VerifyModel, verifyToken, verifyCrud("read"), async function (req, res, next) {
    const Model = req.Model;
    try {
        const crudResponse = req.crudResponse
        const paths = ModelLib.SchemaToPaths(Model, "nested")
        let options = ModelLib.pathsToPopulateVisible(Model, paths)
        console.log(paths);
        console.log(options);
        switch (crudResponse) {
            case true:
                break;
            case false:
                throw { status: 403, message: "User Not Authorized" };
                break;
            default:
                options.where = crudResponse
                break;
        }
        const result = await ModelLib.GetAllModels(Model, options);
        res.send({ data: result });
    } catch (error) {
        console.error(error);
    }
});

router.get('/:Model/GetModel', VerifyModel, verifyToken, verifyCrud("read"), async function (req, res, next) {
    const Model = req.Model;
    try {
        const crudResponse = req.crudResponse
        const paths = ModelLib.SchemaToPaths(Model, "full")
        let options = { where: { id: req.query.id }, ...ModelLib.pathsToPopulateVisible(Model, paths) }
        console.log(paths);
        console.log(options);
        switch (crudResponse) {
            case true:
                break;
            case false:
                throw { status: 403, message: "User Not Authorized" };
                break;
            default:
                options.where = { ...options.where, ...crudResponse }
                break;
        }
        const result = await ModelLib.GetModel(Model, options);
        res.json(result);
    } catch (error) {
        console.error(error);
    }
});
router.patch('/:Model/Update/:id', VerifyModel, verifyToken, verifyCrud("update"), async function (req, res, next) {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown: ' + req.params.id);
    const Model = req.Model;
    try {

        const newModel = await ModelLib.UpdateModel(Model, req.params.id, req.body.data);
        res.send({ data: newModel });
        console.log(newModel);
    } catch (error) {
        console.error(error);
    };
});

router.delete('/:Model/Delete/:id', VerifyModel, verifyToken, verifyCrud("delete"), async function (req, res, next) {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown: ' + req.params.id);
    const Model = req.Model;
    try {
        const result = await ModelLib.DeleteModel(Model, req.params.id);
        res.send(result);
    } catch (error) {
        console.error(error);
    };
});
router.post('/:Model/NGet/:association/:id', VerifyModel, verifyToken, VerifyNAssociation, async function (req, res, next) {
    const Model = req.AssociationModel;
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown: ' + req.params.id);
    try {
        var where = {}
        where[req.options.keyName] = (req.params.id)
        console.log(where);
        const result = await ModelLib.GetAllModels(Model, { where });
        res.send({ data: result });
        console.log(result);
    } catch (error) {
        console.error(error);
    }
});
router.post('/:Model/Get/:association/:id', VerifyModel, verifyToken, VerifyAssociation, async function (req, res, next) {
    const Model = req.Model;
    const AssociationModel = req.AssociationModel;
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown: ' + req.params.id);
    try {
        const instance = await ModelLib.GetModel(Model, { where: { id: req.params.id } });
        const result = await ModelLib.GetModel(AssociationModel, { where: { id: instance[req.associationName + '_id'] } });
        res.send({ data: result });
        console.log(result);
    } catch (error) {
        console.error(error);
    }
});
router.get('/:Model/GetModelRoleById/:id', VerifyModel, verifyToken, async function (req, res, next) {
    const Model = req.Model;
    console.log(Model);
    try {
        const result = await ModelLib.GetModelRoleById(Model, { where: { id: req.params.id } });
        //console.log("result",result);
        res.send({ data: result });
    } catch (error) {
        console.error(error);
    }

});
router.post('/:Model/createUser', VerifyModel, verifyToken, async function (req, res, next) {
    const Model = req.Model;
    try {
        const result = await ModelLib.CreateDiscrimination(Model, req.body.data)
        res.send(result);
        console.log(result);
    } catch (err) {
        const errors = signUpErrors(err);
        res.status(200).send({ errors });
    }

});
module.exports = router;