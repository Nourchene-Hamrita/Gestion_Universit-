const mongoose = require("mongoose");
const crudOptions = {
    "create": false,
    "read": false,
    "update": false,
    "delete": false,
}
const attributes = {
    verified:{
        type:Boolean,
    }
}
const associationsData = {
    user_id: {
        NOptions: {
            parent: true
        },
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

};
schema = mongoose.Schema,
    alumniSchema = new schema({
        ...attributes,
        ...associationsData
    });
const modelAlumni = mongoose.model("alumni", alumniSchema);
class Alumni extends modelAlumni {
    static get crudOptions() { return crudOptions }
    static get attributes() { return attributes }
    static get associationsData() { return associationsData }
    static get NAssociationsData() {
        return {
            contract: {
                type: 'one',
                modelName: 'Contract',
                keyName: 'alumni_id',
                NOptions: {},

            },
            offers: {
                type: 'many',
                modelName: 'Offer',
                keyName: 'alumni_id',
                NOptions: {},

            },

        }
    }
}
module.exports = Alumni;