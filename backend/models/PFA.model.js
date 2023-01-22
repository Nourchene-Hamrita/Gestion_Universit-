const mongoose = require("mongoose");
const crudOptions = {
    "create": false,
    "read": false,
    "update": false,
    "delete": false,
}
const attributes = {
    title: {
        type: String,
        NOptions: {}
    },
    description: {
        type: String,
        NOptions: {}
    },
    teckStack:{
        type:[String],
        NOptions:{}
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
    student_id: {
        NOptions: {
        },
        type: mongoose.Schema.Types.ObjectId,
        ref: "student",
        required: true
    },
    teacher_id: {
        NOptions: {
        },
        type: mongoose.Schema.Types.ObjectId,
        ref: "teacher",
        required: true
    },

};
schema = mongoose.Schema,
    PFASchema = new schema({
        ...attributes,
        ...associationsData
    });
const modelPFA = mongoose.model("pfa", PFASchema);
class PFA extends modelPFA {
    static get crudOptions() { return crudOptions }
    static get attributes() { return attributes }
    static get associationsData() { return associationsData }
    static get NAssociationsData() {
        return {


        }
    }
}
module.exports = PFA;