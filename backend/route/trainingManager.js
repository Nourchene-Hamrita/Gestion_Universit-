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

router.post('/validatePFA', verifyToken, async function (req, res, next) {
    try {
        const user = req.user
        if (!(user.account == "trainingManager"))
            throw { status: 403, message: "User Not Authorized" };
        const { id } = req.body
        const pfa = await ModelLib.UpdateModel(db.PFA, id, { approved: true });
        res.send({ data: pfa });
    } catch (error) {
        HandleError(res, error)
    }
});

module.exports = {
    router
};