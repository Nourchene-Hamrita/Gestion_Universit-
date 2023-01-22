const mongoose = require("mongoose");

const crudOptions = {
    "create": false,
    "read": (user) => (user) => { return ["admin"].includes(user.account) },
    "update": (user) => (user) => { return ["admin"].includes(user.account) },
    "delete": (user) => (user) => { return ["admin"].includes(user.account) },
}
const attributes = {}
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
    teacherSchema = new schema({
        ...attributes,
        ...associationsData
    });
const modelteacher = mongoose.model("teacher", teacherSchema);
class Teacher extends modelteacher {
    static get crudOptions() { return crudOptions }
    static get attributes() { return attributes }
    static get associationsData() { return associationsData }
    static get NAssociationsData() {
        return {
            trainingManager: {
                type: 'one',
                modelName: 'TrainingManager',
                keyName: 'user_id',
                NOptions: {
                    child: true,
                },
            },
            PFAs: {
                type: 'many',
                modelName: 'PFA',
                keyName: 'teacher_id',
                NOptions: {},

            },
            PFEs: {
                type: 'many',
                modelName: 'PFE',
                keyName: 'teacher_id',
                NOptions: {},

            },

        }
    }
}
module.exports = Teacher;