const mongoose = require("mongoose");
const crudOptions = {
    "create": false,
    "read": (user) => { return ["admin", "student"].includes(user.account) },
    "update": false,
    "delete": false,
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
        type: Number,
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