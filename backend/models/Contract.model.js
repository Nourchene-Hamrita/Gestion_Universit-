const mongoose = require("mongoose");
const crudOptions = {
    "create": (user) => { return ["alumni"].includes(user.account) },
    "read": (user) => {
        switch (user.account) {
            case "admin":
                return true
            case "alumni":
                return { alumni_id: user.alumni?.id }
        }
        return false
    },
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
    static get viewOptions() {
        return {
            "full": ["*", "alumni.user.*"],
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
module.exports = Contract;