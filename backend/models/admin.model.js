const mongoose = require("mongoose");
const crudOptions= {
    "create": false,
    "read": (user) => { return ["admin"].includes(user.account) },
    "update": false,
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
    adminSchema = new schema({
        ...attributes,
        ...associationsData
    });
const modelAdmin = mongoose.model("admin", adminSchema);
class Admin extends modelAdmin {
    static get viewOptions() {
        return {
            "full": ["*", "user.*", "user.accessRights.*"],
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
module.exports = Admin;