const mongoose = require("mongoose");

const attributes = {
    title: {
        type: String,
        NOptions: {}
    },
    job: {
        type: String,
        NOptions: {}
    },
    description: {
        type: String,
        NOptions: {}
    },
    date: {
        type: Date,
        NOptions: {}
    },
    
 
}
const associationsData = {
    

};
schema = mongoose.Schema,
    contractSchema = new schema({
        ...attributes,
        ...associationsData
    });
const modelContract = mongoose.model("contract", contractSchema);
class Contract extends modelContract {
    
    static get attributes() { return attributes }
    static get associationsData() { return associationsData }
    static get NAssociationsData() {
        return {


        }
    }
}
module.exports = Contract;