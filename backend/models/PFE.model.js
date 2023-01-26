const mongoose = require("mongoose");
const crudOptions = {
    "create": (user) => { return ["teacher", "student"].includes(user.account) },
    "read": (user) => { return ["admin", "teacher", "student"].includes(user.account) },
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
    teckStack: {
        type: [String],
        NOptions: {}
    },
    company_name: {
        type: String,
        Noptions: {},
    },
    country: {
        type: String,
        Noptions: {},
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
        NOptions: {},
        type: mongoose.Schema.Types.ObjectId,
        ref: "teacher",
        required: true
    },

};
schema = mongoose.Schema,
    PFESchema = new schema({
        ...attributes,
        ...associationsData
    });
const modelPFE = mongoose.model("pFE", PFESchema);
class PFE extends modelPFE {
    static get viewOptions() {
        return {
            "full": ["*", "student.user.*", "teacher.user.*"],
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
            afterUpsert: async (instance, data) => {
                if (data.student_id) {
                    let student = await Student.findById(data.student_id)
                    student.PFE_id = instance.id
                    student.save()
                }
            },



        }
    }
}
module.exports = PFE;