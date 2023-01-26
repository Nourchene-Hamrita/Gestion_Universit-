const mongoose = require("mongoose");
const crudOptions = {
    "create": (user) => { return ["admin", "student"].includes(user.account) },
    "read": (user) => { return ["admin", "student"].includes(user.account) },
    "update": (user) => { return [ "admin", "student"].includes(user.account) },
    "delete":  (user) => { return ["admin"].includes(user.account) },
}
const attributes = {
    requestedInstitut: {
        type: String,
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
    startDate: {
        type: Date,
        NOptions: {}
    },
    endDate: {
        type: Date,
        NOptions: {}
    },
}
const associationsData = {


};
schema = mongoose.Schema,
    eventSchema = new schema({
        ...attributes,
        ...associationsData
    });
const modelEvent = mongoose.model("event", eventSchema);
class Event extends modelEvent {
    static get crudOptions() { return crudOptions }
    static get attributes() { return attributes }
    static get associationsData() { return associationsData }
    static get NAssociationsData() {
        return {


        }
    }
}
module.exports = Event;