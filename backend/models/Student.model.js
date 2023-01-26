const mongoose = require("mongoose");
const crudOptions = {
    "create": false,
    "read": (user) => {
        switch (user.account) {
            case "teacher":
            case "admin":
                return true
            case "alumni":
                return { public: true }
            case "student":
                return { "$or": [{ public: true }, { _id: user.student?.id }] }
        }
        return false
    },
    "update": (user) => {
        switch (user.account) {
            case "admin":
                return true
            case "student":
                return { _id: user.student?.id }
        }
        return false
    },
    "delete": (user) => { return ["admin"].includes(user.account) },
}
const attributes = {
    class: {
        type: String,
        NOptions: {}
    },
    public: {
        type: Boolean,
        default: false,
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
    PFA_id: {
        NOptions: {
        },
        type: mongoose.Schema.Types.ObjectId,
        ref: "pFA",
        required: false
    },
    PFE_id: {
        NOptions: {
        },
        type: mongoose.Schema.Types.ObjectId,
        ref: "pFE",
        required: false
    },
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
    static get viewOptions() {
        return {
            "full": ["*", "user.*", "PFA.*", "PFE.*"],
            "nested": ["*", "user.*"],
        }
    }
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
const MailService = require("../lib/mail");
cron.schedule("00 00 1 3,9 *", async () => {
    const students = await Student.find()
        .populate("user_id")
    for (const student of students) {
        const user = student.user_id
        MailService.SendUserMessage(user, "ajouter un nouveau travail")
    }

})
cron.schedule("00 08 15 7,10 *", async () => {
    //TODO third year only
    const students = await Student.find({ graduationDate: null })
        .populate("user_id")
    for (const student of students) {
        const user = student.user_id
        MailService.SendUserMessage(user, "Mettre à jour date d'obtention de diplome")
    }
})
cron.schedule("00 08 1 1,7 *", async () => {
    //TODO third year only
    const students = await Student.find({ graduationDate: null })
        .populate("user_id")
    for (const student of students) {
        const user = student.user_id
        MailService.SendUserMessage(user, "Mettre a jour date des compétences et profolio")
    }
})