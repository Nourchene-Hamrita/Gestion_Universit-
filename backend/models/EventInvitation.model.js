const mongoose = require("mongoose");
const MailService= require("../lib/mail");
const crudOptions = {
    "create": (user) => { return ["admin"].includes(user.account) },
    "read": (user) => { return ["admin", "alumni"].includes(user.account) },
    "update": (user) => { return ["admin"].includes(user.account) },
    "delete": (user) => { return ["admin"].includes(user.account) },
}
const attributes = {
}
const associationsData = {
    alumni_id: {
        NOptions: {},
        type: mongoose.Schema.Types.ObjectId,
        ref: "alumni",
        required: true
    },
    event_id: {
        NOptions: {},
        type: mongoose.Schema.Types.ObjectId,
        ref: "event",
        required: true
    },

};
schema = mongoose.Schema,
    eventInvitationSchema = new schema({
        ...attributes,
        ...associationsData
    });
const modelEventInvitation = mongoose.model("eventInvitation", eventInvitationSchema);
class EventInvitation extends modelEventInvitation {
    static get viewOptions() {
        return {
            "full": ["*", "alumni.user.*", "event.*"],
        }
    }
    static get crudOptions() { return crudOptions }
    static get attributes() { return attributes }
    static get associationsData() { return associationsData }
    static get NAssociationsData() {
        return {


        }
    }
    static get Nhooks() {
        return {
            beforeCreate: async (instance, data) => {
            },
            beforeUpdate: async (instance, data) => {

            },
            afterUpdate: async (instance, data) => {

            },
            beforeUpsert: async (instance, data) => {

            },
            afterUpsert: async (instance, data) => {
            },

        }
    }
}
module.exports = EventInvitation;