const mongoose = require("mongoose");
const Student = require("./Student.model");
const Teacher = require("./Teacher.model");

const MailService = require("../lib/mail");
const crudOptions = {
    "create": (user) => { return ["teacher", "admin"].includes(user.account) },
    "read": (user) => { return ["teacher", "student", "trainingManager", "admin"].includes(user.account) },
    "update": (user) => { return ["teacher", "student", "admin"].includes(user.account) },
    "delete": (user) => { return ["admin"].includes(user.account) },
}
const attributes = {
    title: {
        type: String,
        NOptions: {}
    },
    approved: {
        type: Boolean,
        default: false,
        NOptions: { immutable: true }
    },
    description: {
        type: String,
        NOptions: {}
    },
    teckStack: {
        type: [String],
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
const modelPFA = mongoose.model("pFA", PFASchema);
class PFA extends modelPFA {
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
            beforeCreate: async (instance, data) => {


            },
            beforeUpdate: async (instance, data) => {

            },
            afterUpdate: async (instance, data) => {

            },
            beforeUpsert: async (instance, data) => {

            },
            afterUpsert: async (instance, data) => {
                if (data.student_id) {
                    let student = await Student.findById(data.student_id).populate("user_id")
                    student.PFA_id = instance.id
                    student.save()
                    const user = student?.user_id
                    MailService.SendUserMessage(user, "Votre PFA a ete affecte")
                }
                if (data.teacher_id) {
                    const teacher = await Teacher.findById(data.teacher_id).populate("user_id")
                    const user = teacher?.user_id
                    MailService.SendUserMessage(user, "Un PFA a ete ajouter")
                }
            },



        }
    }
}
module.exports = PFA;