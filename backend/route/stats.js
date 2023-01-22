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

router.get('/alumni', verifyToken, async function (req, res, next) {
    try {
        const user = req.user
        if (!(user.account == "admin"))
            throw { status: 403, message: "User Not Authorized" };
        const { where } = req.body.where
        //todo stats values
        const alumnis = await db.Alumni.find(where)
        const count = alumnis.length

        let output = {
            count
        }
        res.status(process.env.RESPONSE_OK).send(output)
    } catch (error) {
        HandleError(res, error)
    }
});
router.get('/PFE', verifyToken, async function (req, res, next) {
    try {
        const user = req.user
        if (!(user.account == "admin"))
            throw { status: 403, message: "User Not Authorized" };
        const { where } = req.body.where
        //todo stats values
        const pfes = await db.PFE.find(where)
        const count = pfes.length

        let output = {
            count
        }
        res.status(process.env.RESPONSE_OK).send(output)
    } catch (error) {
        HandleError(res, error)
    }
});

router.get('/unemployement', verifyToken, async function (req, res, next) {
    try {
        const user = req.user
        if (!(user.account == "admin"))
            throw { status: 403, message: "User Not Authorized" };
        let { where } = req.body.where
        where.graduationDate = { "$ne": null }
        //todo stats values
        const alumnis = await db.Alumni.find(where)
        const count = alumnis.length
        const countUnemployed = 0
        let groupByMonth = {}
        for (const alumni of alumnis) {
            if (!alumni.workStartDate) {
                ++countUnemployed
                continue
            }
            const { workStartDate, graduationDate } = alumni
            const diff = workStartDate.getMonth() - graduationDate.getMonth()
                + (workStartDate.getFullYear() - graduationDate.getFullYear()) * 12;
            groupByMonth[diff] = groupByMonth[diff] || 0
            ++groupByMonth[diff]


        }
        let output = {
            count,
            countUnemployed,
            countEmployed: count - countUnemployed,
            groupByMonth
        }
        res.status(process.env.RESPONSE_OK).send(output)
    } catch (error) {
        HandleError(res, error)
    }
});

module.exports = {
    verifyToken,
    router
};