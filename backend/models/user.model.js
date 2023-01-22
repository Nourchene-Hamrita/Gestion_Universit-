const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const crudOptions = {
    "create": true,
    "read": (user) => { return { _id: user?.id } },
    "update": true,
    "delete": true,
}
let userSchema = new mongoose.Schema;
const attributes = {
    firstName: {
        type: String,
        required: true,
        NOptions: {}

    },
    lastName: {
        type: String,
        required: true,
        NOptions: {}

    },
    address: {
        type: String,
        NOptions: {}

    },
    email: {
        type: String,
        required: true,
        unique: true,
        NOptions: {}

    },
    password: {
        type: String,
        required: true,
        NOptions: {
            invisible: true,
        }

    },
    phoneNumber: {
        type: String,
        NOptions: {}

    },
    dateOfBirth: {
        type: Date,
        NOptions: {}

    },

    account: {
        type: String,
        enum: ['admin', 'student', 'alumni', 'teacher', 'administrative', 'trainingManager'],
        NOptions: {
            discriminatorKey: true,
            // immutable: true,
        }
    },
    passwordChangedDate: {
        type: Date,
        NOptions: {
            invisible: true, immutable: true,
        }
    },

    createdAt: {
        type: Date,
        default: Date.now,
        NOptions: {}
    }

};
const associationsData = {

};


schema = mongoose.Schema
userSchema = new schema({
    ...attributes,
    ...associationsData,

})
const modelUser = mongoose.model("user", userSchema);
class User extends modelUser {
    static get attributes() {
        return attributes
    }
    static get crudOptions() { return crudOptions }
    static get associationsData() { return associationsData }
    static get NAssociationsData() {
        return {
            admin: {
                type: 'one',
                modelName: 'Admin',
                keyName: 'user_id',
                NOptions: {
                    child: true
                },
            },
            student: {
                type: 'one',
                modelName: 'Student',
                keyName: 'user_id',
                NOptions: {
                    child: true,
                },
            },
             alumni: {
                type: 'one',
                modelName: 'Alumni',
                keyName: 'user_id',
                NOptions: {
                    child: true,
                },
            },

            teacher: {
                type: 'one',
                modelName: 'Teacher',
                keyName: 'user_id',
                NOptions: {
                    child: true,
                },
            },
            administrative: {
                type: 'one',
                modelName: 'Administrative',
                keyName: 'user_id',
                NOptions: {
                    child: true
                },
            },
            trainingManager: {
                type: 'one',
                modelName: 'TrainingManager',
                keyName: 'user_id',
                NOptions: {
                    child: true
                },
            },

        }
    };
    static get Nhooks() {
        return {
            beforeCreate: async (instance, data) => {


            },
            beforeUpdate: async (instance, data) => {

            },
            afterUpdate: async (instance, data) => {

            },
            beforeUpsert: async (instance, data) => {
                if (data.firstname && data.lastname) {
                    const fullname = data.firstname + ' ' + data.lastname;
                    data.fullname = fullname;
                    console.log('fullname', fullname);
                }
                console.log("data", data);
                if ("password" in data) {
                    const salt = await bcrypt.genSalt();
                    data.password = await bcrypt.hash(data.password, salt);
                }
            },
            afterUpsert: async (instance, data) => {

            },



        }
    }
};
module.exports = User;