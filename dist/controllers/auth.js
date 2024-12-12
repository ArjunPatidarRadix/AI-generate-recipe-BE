"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postNewPassword = exports.postLogout = exports.postSignup = exports.postLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// import nodemailer from "nodemailer";
// import sendgridTransport from "nodemailer-sendgrid-transport";
const express_validator_1 = require("express-validator");
const UserModel_1 = require("../models/UserModel");
// const transporter = nodemailer.createTransport(
//   sendgridTransport({
//     auth: {
//       api_key: process.env.SENDGRID_API_KEY,
//     },
//   })
// );
const postLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(422).send({
            message: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
            },
            validationErrors: errors.array(),
        });
        return;
    }
    try {
        const user = yield UserModel_1.User.findByCredentials(req.body.email, req.body.password);
        const token = yield user.generateAuthToken();
        delete user.tokens;
        delete user.password;
        res.send({ message: "Login successful", data: { user, token } });
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});
exports.postLogin = postLogin;
const postSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            res.status(422).send({
                message: errors.array()[0].msg,
                oldInput: {
                    name: name,
                    email: email,
                    password: password,
                    confirmPassword: req.body.confirmPassword,
                },
                validationErrors: errors.array(),
            });
            return;
        }
        const user = new UserModel_1.User({
            name: name,
            email: email,
            password: password,
        });
        yield user.save();
        const token = yield user.generateAuthToken();
        const data = JSON.parse(JSON.stringify(user));
        delete data.tokens;
        delete data.password;
        res.status(200).send({
            message: "Register successfull",
            data: Object.assign(Object.assign({}, data), { token }),
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.postSignup = postSignup;
const postLogout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        yield req.user.save();
        res.send();
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});
exports.postLogout = postLogout;
const postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    UserModel_1.User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId,
    })
        .then((user) => {
        resetUser = user;
        return bcryptjs_1.default.hash(newPassword, 12);
    })
        .then((hashedPassword) => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    })
        .then((result) => {
        res.status(200).send(result);
    })
        .catch((err) => {
        console.log(err);
        const error = new Error(err);
        return next(error);
    });
};
exports.postNewPassword = postNewPassword;
