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
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const UserModel_1 = require("../models/UserModel");
const isAuth_1 = require("../middleware/isAuth");
const auth_1 = require("../controllers/auth");
const authRouter = express_1.default.Router();
authRouter.post("/login", [
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please enter a valid email address.")
        .normalizeEmail(),
    (0, express_validator_1.body)("password", "Password has to be valid.").isLength({ min: 5 }).trim(),
], auth_1.postLogin);
authRouter.post("/signup", [
    (0, express_validator_1.check)("email")
        .isEmail()
        .withMessage("Please enter a valid email")
        .custom((value_1, _a) => __awaiter(void 0, [value_1, _a], void 0, function* (value, { req }) {
        console.log("value:: ", value);
        if (value) {
            const isExist = yield UserModel_1.User.isUserExist(value);
            console.log("isExist:::", isExist);
            if (isExist) {
                // return Promise.reject(
                //   "Email already exists, please use different email"
                // );
                throw new Error("Email already exists, please use different email");
            }
            return true;
        }
        else {
            return Promise.reject("Email required");
        }
    })),
    (0, express_validator_1.body)("password", "Please enter a min length to 5").isLength({ min: 5 }),
    (0, express_validator_1.body)("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password have to match");
        }
        return true;
    }),
], auth_1.postSignup);
authRouter.post("/logout", isAuth_1.isAuth, auth_1.postLogout);
// router.post("/reset", postReset);
// router.post("/new-password", authController.postNewPassword);
exports.default = authRouter;
