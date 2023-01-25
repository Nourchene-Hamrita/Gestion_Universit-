const mongoose = require("mongoose");
const crudOptions = {
    "create": false,
    "read": (user) => { return ["admin"].includes(user.account) },
    "update": (user) => { return ["admin"].includes(user.account) },
    "delete": false,
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
    accessRightsSchema = new schema({
        ...attributes,
        ...associationsData
    });
const modelAccessRights = mongoose.model("accessRight", accessRightsSchema);
class AccessRights extends modelAccessRights {
    static get viewOptions() {
        return {
            "full": ["*", "user.*"],
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
module.exports = AccessRights;