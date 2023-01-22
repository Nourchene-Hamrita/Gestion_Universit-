const StringLib = require("./string");
var util = require('util');
const ObjectID = require('mongoose').Types.ObjectId;



class ModelLib {
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
    }
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
};