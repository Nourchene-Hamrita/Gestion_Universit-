const mongoose = require("mongoose");
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
    static get attributes() { return attributes }
    static get associationsData() { return associationsData }
    static get NAssociationsData() {
        return {
            alumni: {
                type: 'one',
                modelName: 'Alumni',
                keyName: 'student_id',
                NOptions: {
                    child: true,
                },
            },
            PFA: {
                type: 'one',
                modelName: 'PFA',
                keyName: 'student_id',
               
            },
            PFE: {
                type: 'one',
                modelName: 'PFE',
                keyName: 'student_id',
               
            },

        }
    }
}
module.exports = Student;