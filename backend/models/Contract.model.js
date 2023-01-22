const mongoose = require("mongoose");
const crudOptions = {
    "create": false,
    "read": false,
    "update": false,
    "delete": false,
}
const attributes = {
    type: {
        type: String,
        NOptions: {}
    },
    duration: {
        type: String,
        NOptions: {}
    },

}
const associationsData = {
    alumni_id: {
        NOptions: {},
        type: mongoose.Schema.Types.ObjectId,
        ref: "alumni",
        required: true
    },

};
schema = mongoose.Schema,
    contractSchema = new schema({
        ...attributes,
        ...associationsData
    });
const modelContract = mongoose.model("contract", contractSchema);
class Contract extends modelContract {
    static get crudOptions() { return crudOptions }
    static get attributes() { return attributes }
    static get associationsData() { return associationsData }
    static get NAssociationsData() {
        return {


        }
    }
}
module.exports = Contract;