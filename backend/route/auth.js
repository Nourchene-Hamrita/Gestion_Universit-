const jwt = require("jsonwebtoken")
var bcrypt = require('bcryptjs');

const express = require('express');
const router = express.Router();
const db = require('../models');
const ModelLib = require('../lib/modelLib');
const { signUpErrors } = require('../utils/errors.utils');

const User = db.User;
function HandleError(res, error) {
    res.status(error.status || 400).send(error.message || error)
}
function decodeToken(token) {
    if (!token) throw { message: `Token Not Found`, status: 401 }
    const decoded = jwt.verify(token, "nour")
    if (!decoded) throw { message: `Unvalid Token`, status: 401 }
    const { id, date, type } = decoded
    return { id, date, type }
}
async function verifyToken(req, res, next) {
    try {
        const token = req.headers["user-token"]
        const decoded = decodeToken(token)
        const { id, date } = decoded
        const paths = ModelLib.SchemaToPaths(User, "auth")
        let options = ModelLib.pathsToPopulate(User, paths)
        options.where = { id }
        console.log(paths);
        console.log(options);
        const user = await ModelLib.GetModel(User, options)
        console.log(user);
        if (!user) throw { message: `User Not Found`, status: 401 }
        const { activated, passwordChangedDate, logoutDate } = user
        // if (activated == false) {
        //     throw { message: `User Not Activated`, status: 401 }
        // }
        // if (passwordChangedDate && date < passwordChangedDate.getTime()) {
        //     throw { message: `User Password Changed`, status: 401 }
        // }
        // if (logoutDate && date < logoutDate.getTime()) {
        //     throw { message: `User LogedOut`, status: 401 }
        // }
        req.user = user
        next()
    } catch (error) {
        res.status(error.status || 400).send(error.message || error)
    }
}
router.post('/login', async function (req, res) {
    try {
        const { email, password } = req.body.data
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).send({ auth: false, token: null, message: 'Authentication Failed' });
        }
        var passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(400).send({ auth: false, token: null, message: 'Authentication Failed' });
        // if (!user.activated) {
        //     console.log('authenticated user of id:' + user.id + '. User is deactivated');
        //     return res.status(400).send({ auth: false, token: null, message: 'authenticated user of id:' + user.id + '. User is deactivated' });
        // }
        const now = new Date(Date.now())
        var token = jwt.sign({ id: user.id, date: now }, "nour", {
            expiresIn: 24 * 60 * 60 * 1000// expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token, user });
    } catch (error) {
        HandleError(res, error)
    }
});
router.post('/register', async function (req, res, next) {
    try {
        const user = await ModelLib.CreateDiscrimination(User, req.body.data)
        var token = jwt.sign({ id: user.id, date: new Date() }, "nour", {
            expiresIn: 24 * 60 * 60 * 1000// expires in 24 hours
        });
        res.send({ auth: true, token: token, user });
    } catch (err) {
        console.error(err);
        const errors = signUpErrors(err);
        res.status(200).send({ errors });
    }

});

router.post('/ChangePassword', verifyToken, async function (req, res, next) {
    try {
        const oldPassword = req.body.data.oldPassword
        if (!bcrypt.compareSync(oldPassword, req.user.password)) {
            return res.status(process.env.RESPONSE_ERROR).send('Current Password is not valid')
        }
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(req.body.data.password, salt);
        req.user.password=password
        await req.user.save()
        res.status(200).send({ msg: "ok" })
    } catch (error) {
        HandleError(res, error)
    }
});

module.exports = {
    verifyToken,
    router
};