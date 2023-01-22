const mongoose = require("mongoose");
const crudOptions = {
    "create": false,
    "read": false,
    "update": false,
    "delete": false,
}
const attributes = {
    class: {
        type: String,
        NOptions: {}
    },
    status: {
        type: String,
        enum: ['actuel', 'alumni'],
        NOptions: {}
    },
    graduationDate: {
        type: Date,
        NOptions: {}
    },
    score: {
        type: Number,
        NOptions: {}
    },
    skills: {
        type: [String],
        NOptions: {}
    },
    trainings: {
        type: [String],
        NOptions: {}
    },
    summerInternship: [
        {
            title: String,
            job: String,
            description: String,
            date: Date,
        },
    ],


}
const associationsData = {
    user_id: {
        NOptions: {
            parent: true
        },
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

};
schema = mongoose.Schema,
    studentSchema = new schema({
        ...attributes,
        ...associationsData
    });
const modelStudent = mongoose.model("student", studentSchema);
class Student extends modelStudent {
    static get crudOptions() { return crudOptions }
    static get attributes() { return attributes }
    static get associationsData() { return associationsData }
    static get NAssociationsData() {
        return {
           
            PFA: {
                type: 'one',
                modelName: 'PFA',
                keyName: 'student_id',
                NOptions: {},
               

            },
            PFE: {
                type: 'one',
                modelName: 'PFE',
                keyName: 'student_id',
                NOptions: {},
               
            },

        }
    }
}
module.exports = Student;

const cron = require('node-cron');
const { MailService } = require("../lib/mail");
cron.schedule("00 00 1 3,9 *", async () => {
    const students = await Student.find()
        .populate("user_id")
    for (const student of students) {
        const user = student.user_id
        MailService.SendUserMessage(user, "ajouter un nouveau travail")
    }

})