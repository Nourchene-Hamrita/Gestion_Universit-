const mongoose = require("mongoose");
const crudOptions = {
    "create": false,
    "read": (user) => { return ["admin"].includes(user.account) },
    "update": (user) => { return ["admin"].includes(user.account) },
    "delete": (user) => { return ["admin"].includes(user.account) },
}
const attributes = {}
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
    administrativeSchema = new schema({
        ...attributes,
        ...associationsData
    });
const modelAdministrative = mongoose.model("administrative", administrativeSchema);
class Administrative extends modelAdministrative {
    static get viewOptions() {
        return {
            "full": ["*", "user.*", "PFA.*", "PFE.*"],
            "nested": ["*", "user.*"],
        }
    }
    static get crudOptions() { return crudOptions }
    static get attributes() { return attributes }
    static get associationsData() { return associationsData }
    static get NAssociationsData() {
        return {


        }
    }
}
module.exports = Administrative;