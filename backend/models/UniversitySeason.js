const mongoose = require("mongoose");

const attributes = {
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
    

};
schema = mongoose.Schema,
    USeasonSchema = new schema({
        ...attributes,
        ...associationsData
    });
const UniversitySeasonmodel = mongoose.model("UniversitySeason", USeasonSchema);
class UniversitySeason extends UniversitySeasonmodel {
    
    static get attributes() { return attributes }
    static get associationsData() { return associationsData }
    static get NAssociationsData() {
        return {


        }
    }
}
module.exports = UniversitySeason;