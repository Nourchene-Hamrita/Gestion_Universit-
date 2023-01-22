const mongoose = require("mongoose");

const attributes = {
    type: {
        type: String,
        NOptions: {}
    },
    duration: {
        type: String,
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