const mongoose = require("mongoose");
const crudOptions = {
    "create": (user) => { return ["student"].includes(user.account) },
    "read":  (user) => { return ["student"].includes(user.account) },
    "update":  (user) => { return ["student"].includes(user.account) },
    "delete":  (user) => { return ["student"].includes(user.account) },
}
const attributes = {
    title: {
        type: String,
        NOptions: {}
    },
    job: {
        type: String,
        NOptions: {}
    },
    description: {
        type: String,
        NOptions: {}
    },
    date: {
        type: Date,
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

};
schema = mongoose.Schema,
    experienceSchema = new schema({
        ...attributes,
        ...associationsData
    });
const modelExperience = mongoose.model("experience", experienceSchema);
class Experience extends modelExperience {
    static get viewOptions() {
        return {
            "full": ["*", "student.user.*"],
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
module.exports = Experience;