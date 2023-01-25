const mongoose = require("mongoose");
const crudOptions = {
    "create": (user) => { return ["alumni"].includes(user.account) },
    "read": false,
    "update": false,
    "delete": false,
}
const attributes = {
    type: {
        type: String,
        enum: ['advice', 'job offer', 'opportunity'],
        NOptions: {}
    },
    title: {
        type: String,
        NOptions: {}
    },
    description: {
        type: String,
        NOptions: {}
    },
    createdAt: {
        type: Date,
        default: Date.now,
        NOptions: {}
    }

}
const associationsData = {
    alumni_id: {
        NOptions: {
        },
        type: mongoose.Schema.Types.ObjectId,
        ref: "alumni",
        required: true
    },

};
schema = mongoose.Schema,
    offerSchema = new schema({
        ...attributes,
        ...associationsData
    });
const modelOffer = mongoose.model("offer", offerSchema);
class Offer extends modelOffer {
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
module.exports = Offer;