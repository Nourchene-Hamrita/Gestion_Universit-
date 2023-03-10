const mongoose = require("mongoose");
const crudOptions = {
    "create": false,
    "read": false,
    "update": false,
    "delete": false,
}
const attributes = {}
const associationsData = {
    teacher_id: {
        NOptions: {
            parent: true
        },
        type: mongoose.Schema.Types.ObjectId,
        ref: "teacher",
        required: true
    },

};
schema = mongoose.Schema,
    TManagerSchema = new schema({
        ...attributes,
        ...associationsData
    });
const modelTrainingManager = mongoose.model("trainingManager", TManagerSchema);
class TrainingManager extends modelTrainingManager {
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


        }
    }
}
module.exports = TrainingManager;