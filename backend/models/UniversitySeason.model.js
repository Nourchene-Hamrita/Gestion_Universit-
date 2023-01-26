const mongoose = require("mongoose");
const crudOptions = {
    "create": (user) => { return ["admin"].includes(user.account) },
    "read": (user) => { return ["admin"].includes(user.account) },
    "update": false,
    "delete": false,
}
const attributes = {
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


};
schema = mongoose.Schema,
    USeasonSchema = new schema({
        ...attributes,
        ...associationsData
    });
const UniversitySeasonmodel = mongoose.model("UniversitySeason", USeasonSchema);
class UniversitySeason extends UniversitySeasonmodel {
    static get crudOptions() { return crudOptions }
    static get attributes() { return attributes }
    static get associationsData() { return associationsData }
    static get NAssociationsData() {
        return {


        }
    }
}
module.exports = UniversitySeason;