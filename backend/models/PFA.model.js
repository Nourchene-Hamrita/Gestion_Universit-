const mongoose = require("mongoose");
const { User, Student, Teacher } = require(".");
const { MailService } = require("../lib/mail");
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
    teckStack: {
        type: [String],
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
                    const student = await Student.findById(data.student_id).populate("user_id")
                    const user = student?.user_id
                    await MailService.SendUserMessage(user, "Votre PFA a ete affecte")
                }
                if (data.teacher_id) {
                    const teacher = await Teacher.findById(data.teacher_id).populate("user_id")
                    const user = teacher?.user_id
                    await MailService.SendUserMessage(user, "Un PFA a ete ajouter")
                }
            },



        }
    }
}
module.exports = PFA;