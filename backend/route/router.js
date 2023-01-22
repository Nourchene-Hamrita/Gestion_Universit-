const express = require('express');
const router = express.Router();
const db = require('../models');
const ModelLib = require('../lib/modelLib');
const { signUpErrors } = require('../utils/errors.utils');


function VerifyModel(req, res, next) {
    const Model = db[req.params.Model];
    if (!Model) {
        return res.status(process.env.RESPONSE_ERROR).send('unknown Model:', req.params.Model);
    }
    req.Model = Model;
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
            return next();
        }
    };
    return res.status(400).send('association is not valid')
};
router.post('/:Model/Create', VerifyModel, async function (req, res, next) {
    const Model = req.Model;
    try {
        const result = await ModelLib.CreateModel(Model, req.body.data);
        res.send(result);
        console.log(result);
    } catch (error) {
        console.error(error);
    }

});
router.get('/:Model/GetAllModels', VerifyModel, async function (req, res, next) {
    const Model = req.Model;
    try {
        const result = await ModelLib.GetModel(Model);
        res.send({ data: result });
        console.log(result);
    } catch (error) {
        console.error(error);
    }
});
router.get('/:Model/GetModel', VerifyModel, async function (req, res, next) {
    const Model = req.Model;
    try {
        const result = await ModelLib.GetModel(Model, req.body.id);
        res.json(result);
        console.log(result.get('email', null, { getters: true }));
        console.log(result);
    } catch (error) {
        console.error(error);
    }
});
router.patch('/:Model/Update/:id', VerifyModel, async function (req, res, next) {
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

router.delete('/:Model/Delete/:id', VerifyModel, async function (req, res, next) {
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
router.post('/:Model/NGet/:association/:id', VerifyModel, VerifyNAssociation, async function (req, res, next) {
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
router.post('/:Model/Get/:association/:id', VerifyModel, VerifyAssociation, async function (req, res, next) {
    const Model = req.Model;
    const AssociationModel = req.AssociationModel;
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown: ' + req.params.id);
    try {
        const instance = await ModelLib.GetModel(Model, req.params.id);
        const result = await ModelLib.GetModel(AssociationModel, instance[req.associationName + '_id']);
        res.send({ data: result });
        console.log(result);
    } catch (error) {
        console.error(error);
    }
});
router.get('/:Model/GetModelRoleById/:id', VerifyModel, async function (req, res, next) {
    const Model = req.Model;
    console.log(Model);
    try {
        const result = await ModelLib.GetModelRoleById(Model, req.params.id);
        //console.log("result",result);
        res.send({ data: result });
    } catch (error) {
        console.error(error);
    }

});
router.post('/:Model/createUser', VerifyModel, async function (req, res, next) {
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