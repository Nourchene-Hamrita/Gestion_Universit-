const jwt = require("jsonwebtoken")
var bcrypt = require('bcryptjs');

const express = require('express');
const router = express.Router();
const db = require('../models');
const ModelLib = require('../lib/modelLib');
const { signUpErrors } = require('../utils/errors.utils');
const { verifyToken } = require("./auth");

const User = db.User;
function HandleError(res, error) {
    res.status(error.status || 400).send(error.message || error)
}

router.post('/validateAlumni', verifyToken, async function (req, res, next) {
    try {
        const user = req.user
        if (!(user.account == "admin"))
            throw { status: 403, message: "User Not Authorized" };
        const { id } = req.body
        const alumni = await db.Alumni.updateOne({ _id: id }, { verified: true });
        res.send({ data: alumni });
    } catch (error) {
        HandleError(res, error)
    }
});
router.post('/setAccessRights', verifyToken, async function (req, res, next) {
    try {
        const user = req.user
        if (!(user.account == "admin"))
            throw { status: 403, message: "User Not Authorized" };
        const { user_id, accessRights } = req.body
        const alumni = await db.User.updateOne({ _id: user_id }, { accessRights });
        res.send({ data: alumni });
    } catch (error) {
        HandleError(res, error)
    }
});


module.exports = {
    router
};