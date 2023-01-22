const mongoose = require("mongoose");
const crudOptions= {
    "create": false,
    "read": false,
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
    static get crudOptions() { return crudOptions }
    static get attributes() { return attributes }
    static get associationsData() { return associationsData }
    static get NAssociationsData() {
        return {


        }
    }
}
module.exports = Admin;
const cron = require('node-cron');
cron.schedule("* * * * *", async () => {
    const admins = await Admin.find()
        .populate("user_id")
    for (const admin of admins) {
        const user = admin.user_id
        console.log(admin);
    }
})