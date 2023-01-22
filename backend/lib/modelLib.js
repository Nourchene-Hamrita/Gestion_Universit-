const StringLib = require("./string");
var util = require('util');
const ObjectID = require('mongoose').Types.ObjectId;


class ModelLib {
    static GetAttributeOptions(Model, attributeName, data) {
        const attribute = Model.attributes[attributeName]
        const options = attribute ? attribute.NOptions : null;
        if (!options) return null;
        options.invisible = ('invisible' in options) ? options.invisible : false
        options.discriminatorKey = ('discriminatorKey' in options) ? options.discriminatorKey : false
        options.immutable = ('immutable' in options) ? options.immutable : false
        options.noUpsert = ('noUpsert' in options) ? options.noUpsert : false
        options.virtual = ('virtual' in options) ? options.virtual : false
        return options;
    };
    static GetAssociationOptions(Model, associationName, data) {
        const association = Model.associationsData[associationName + '_id'];
        const options = association ? association.NOptions : null;
        if (!options) return null;
        options.associationName = associationName;
        options.keyName = associationName + '_id';
        options.modelName = StringLib.capitalizeFirstLetter(association.ref);
        options.ref = association.ref;
        options.AssociationModel = Model.db.base.models[association.ref];
        options.AssociationModel = Model.Ndb[options.modelName];
        console.log(options.modelName, options.AssociationModel.associationsData);
        options.associationCollectionName = options.AssociationModel.collection.collectionName;
        options.parent = ('parent' in options) ? options.parent : false;

        return options;
    };
    static GetNAssociationOptions(Model, associationName, data) {
        const association = Model.NAssociationsData[associationName];
        const options = association ? association.NOptions : null;
        if (!options) return null;
        options.modelName = association.modelName;
        options.ref = StringLib.lowerCaseFirstLetter(options.modelName);

        options.AssociationModel = Model.db.base.models[options.ref];
        options.AssociationModel = Model.Ndb[options.modelName];
        console.log(options.modelName, options.AssociationModel.associationsData);

        options.associationCollectionName = options.AssociationModel.collection.collectionName;

        options.associationType = association.type;
        options.keyName = association.keyName;
        options.child = ('child' in options) ? options.child : false;

        return options;

    };
    static GetVirtualAttributes(Model) {
        var attributes = [];
        for (const attributeName of Object.keys(Model.attributes)) {
            const options = ModelLib.GetAttributeOptions(Model, attributeName, {});
            if ((options && options.virtual)) {
                attributes.push(attributeName);
                continue;
            };
        };
        return attributes;

    };
    //where:{invisible:true}
    //where:{invisible:false}
    static GetAttributes(Model, where = {}) {
        var attributes = [];
        for (const attributeName of Object.keys(Model.attributes)) {
            var filter = true
            const options = ModelLib.GetAttributeOptions(Model, attributeName, {});
            for (const key in where) {
                if (key in options && options[key] != where[key]) {
                    filter = false;
                    break;
                }
            };
            if (filter)
                attributes.push(attributeName)
        };

        return attributes;
    };
    static VerifyData(Model, data) {
        const immutableAttributes = ModelLib.GetAttributes(Model, { immutable: true });
        const noUpsertAttributes = ModelLib.GetAttributes(Model, { noUpsert: true });
        console.log(noUpsertAttributes);
        for (const immutable of immutableAttributes) {
            delete data[immutable];
        }
        for (const noUpsert of noUpsertAttributes) {
            delete data[noUpsert];
        }
    }
    static GetChildrenAttributes(Model) {
        var attributes = [];
        for (const attributeName of Object.keys(Model.NAssociationsData)) {
            const options = ModelLib.GetNAssociationOptions(Model, attributeName, {});
            if ((options && options.child)) {
                attributes.push(attributeName);
                continue;
            };
        };
        return attributes;
    };
    static GetAssociationAttributes(Model) {
        var attributes = [];
        for (const key of Object.keys(Model.associationsData)) {
            const attributeName = key.substring(0, key.length - 3)
            const options = ModelLib.GetAssociationOptions(Model, attributeName, {});
            console.log(attributeName, options);
            if ((options && options.association)) {
                attributes.push(attributeName);
                continue;
            };
        };
        return attributes;


    };
    static GetParentAttribute(Model) {
        for (const key of Object.keys(Model.associationsData)) {
            const attributeName = key.substring(0, key.length - 3)
            const options = ModelLib.GetAssociationOptions(Model, attributeName, {});
            if ((options && options.parent)) {
                return attributeName
            };
        };
        return null;
    };
    static GetDiscriminatorKey(Model) {
        for (const attributeName of Object.keys(Model.attributes)) {
            const options = ModelLib.GetAttributeOptions(Model, attributeName, {});
            if ((options && options.discriminatorKey)) {
                return attributeName;

            };
        };
        return null;
    };

    static async CreateModel(Model, data) {
        const beforeEvents = ['beforeUpsert', 'beforeCreate',];
        const afterEvents = ['afterCreate', 'afterUpsert'];
        const checkData = ModelLib.VerifyData(Model, data);
        const noUpsertAttributes = ModelLib.GetAttributes(Model, { noUpsert: true })
        const modelHooks = Model.Nhooks;
        var instance = {};
        try {
            for (const event of beforeEvents) {
                if (modelHooks && event in modelHooks) {
                    await modelHooks[event](instance, data)
                };
            };
            for (const noUpsert of noUpsertAttributes) {
                delete data[noUpsert];
            };
            const newModel = new Model({
                ...data
            });
            console.log('fullname', newModel.fullname);
           

            const docs = await newModel.save();

            for (const event of afterEvents) {
                if (modelHooks && event in modelHooks) {
                    await modelHooks[event](instance, data);
                };
            };
            docs.set({ email: data.email });
            return docs;
        } catch (error) {
            console.error(error);
            return null;
        };
    };
    static async GetAllModels(Model, options = {}) {
        console.log(Model);
        const where = options.where ? options.where : {}
        const invisibleAttributes = ModelLib.GetAttributes(Model, { invisible: true });
        var str = "-" + invisibleAttributes.join(" -");
        console.log(str);
        console.log(where);

        try {
            const model = await Model.find(where).select(str);
            return model;
        } catch (err) {
            console.error(err);
            return null;
        };

    };
    static async GetModel(Model, id, options = {}) {
        const where = options.where ? options.where : {}
        const invisibleAttributes = ModelLib.GetAttributes(Model, { invisible: true });
        var str = '-' + invisibleAttributes.join(" -");
        console.log(str);
        console.log(where);
        if (id) {
            try {
                const model = await Model.findById({ _id: id }).select(str);
                const email = model.get('email', null, { getters: true });
                model.email = email;
                return (model);
            } catch (error) {
                console.error(error);
                return null;
            }
        } else {
            try {
                const model = await Model.findOne(where).select(str);
                return model;
            } catch (err) {
                console.error(err);
                return null;
            };

        }
    };
    static GetModelRoleById(Model, id) {
        return new Promise((resolve, reject) => {
            const roleChildrenAttributes = ModelLib.GetChildrenAttributes(Model);
            const roleParentAttribute = ModelLib.GetParentAttribute(Model);
            const associationAttribute = ModelLib.GetAssociationAttributes(Model);
            console.log(associationAttribute);
            const visibleAttributes = ModelLib.GetAttributes(Model, { invisible: false });
            console.log(visibleAttributes);

            var agregateList = [
                { $match: { _id: ObjectID(id) } },
            ]
            var project = {};

            for (const associationName of roleChildrenAttributes) {
                const nOptions = ModelLib.GetNAssociationOptions(Model, associationName, {});
                //console.log(associationName);
                var where = {};
                var key = {};
                where[nOptions.keyName] = "$_id"
                key[nOptions.keyName] = 0
                //console.log(where);
                const agregateItem = {
                    $lookup: {
                        from: nOptions.associationCollectionName,
                        as: associationName,
                        let: where,
                        pipeline: [{ $match: { $expr: { $eq: ['$' + nOptions.keyName, '$$' + nOptions.keyName] } } },
                        { $project: key }
                        ]
                    },
                };
                agregateList.push(agregateItem)
                project[associationName] = 1
                for (const i of visibleAttributes) {
                    project[i] = 1
                }
            };
            if (roleParentAttribute) {
                const options = ModelLib.GetAssociationOptions(Model, roleParentAttribute, {});
                const invisibleAttributes = ModelLib.GetAttributes(options.AssociationModel, { invisible: true });
                //console.log("invisibleAttributes", invisibleAttributes);
                console.log(roleParentAttribute);
                var where = {};
                where["parent_id"] = "$" + options.keyName
                //console.log(where);
                var invisible = {};
                for (const i of invisibleAttributes) {
                    invisible[i] = 0
                }

                const agregateItem = {
                    $lookup: {
                        from: options.associationCollectionName,
                        as: roleParentAttribute,
                        let: where,
                        pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$parent_id'] } } },
                        { $project: invisible }
                        ]
                    },
                };
                agregateList.push(agregateItem)
                project[roleParentAttribute] = 1
                for (const i of associationAttribute) {
                    project[i + "_id"] = 1
                }
            };
            if (Object.keys(project).length > 0) {
                agregateList.push({ $project: project })
                if (roleParentAttribute) {
                    var unwind = '$' + roleParentAttribute;
                    agregateList.push({ $unwind: unwind })
                };
            };
            console.log(util.inspect(agregateList, false, 10, true));
            Model.aggregate(agregateList).exec((err, result) => {
                if (err) {
                    console.log("err", err);
                    reject(err);
                };
                if (result) {
                    console.log("result", result);
                    resolve(result);
                };
            });
        });
    };
    static async CreateDiscrimination(Model, data = {}) {
        const roleChildrenAttributes = ModelLib.GetChildrenAttributes(Model);
        const discriminatorKey = ModelLib.GetAttributes(Model, { discriminatorKey: true })[0]//account
        const noUpsertAttributes = ModelLib.GetAttributes(Model, { noUpsert: true });
        console.log(discriminatorKey);
        console.log(roleChildrenAttributes);
        for (const noUpsert of noUpsertAttributes) {
            delete data[noUpsert];

        }
        delete data._id;
        const newModel = new Model({
            ...data
        });
        try {
            var parent = await newModel.save();
            const associationName = data[discriminatorKey]
            const nOptions = ModelLib.GetNAssociationOptions(Model, associationName, {});
            var childData = data;
            childData[nOptions.keyName] = newModel._id;
            const newChildModel = new nOptions.AssociationModel(childData);
            const child = await newChildModel.save();
            console.log(associationName);
            console.log(child);
            parent[associationName] = child;
            return parent;
        } catch (error) {
            console.error(error);
        }

    };
    static async UpdateModel(Model, id, data) {
        const beforeEvents = ['beforeUpsert', 'beforeUpdate',];
        const afterEvents = ['afterUpdate', 'afterUpsert'];
        const checkData = ModelLib.VerifyData(Model, data);
        const modelHooks = Model.Nhooks;
        try {
            const instance = await Model.findOne({ _id: id })
            console.log("instance", instance);
            for (const event of beforeEvents) {
                if (modelHooks && event in modelHooks) {
                    await modelHooks[event](instance, data)
                }
            }
            for (const key in data) {
                instance[key] = data[key];
                instance.markModified(key);
            };
            instance.set({ email: data.email });
            instance.save((err) => {
                console.log(err);
            });
            for (const event of afterEvents) {
                if (modelHooks && event in modelHooks) {
                    await modelHooks[event](instance, data)
                }
            };
            return (instance);
        } catch (error) {
            console.error(error);

        };
    };
    static async DeleteModel(Model, id) {
        try {
            const model = await Model.deleteOne({ _id: id }).exec();
            return ('successfully deleted : ' + id);
        } catch (error) {
            console.log(error);
            return null;
        };
    };
};

module.exports = ModelLib;
