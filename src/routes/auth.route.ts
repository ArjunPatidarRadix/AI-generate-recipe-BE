import express from "express";
import { check, body } from "express-validator";

import { User } from "../models/UserModel";
import { isAuth } from "../middleware/isAuth";
import {
  getProfile,
  postLogin,
  postLogout,
  postSignup,
} from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),
    body("password", "Password has to be valid.").isLength({ min: 5 }).trim(),
  ],
  postLogin
);

authRouter.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom(async (value, { req }) => {
        console.log("value:: ", value);

        if (value) {
          const isExist = await User.isUserExist(value);

          console.log("isExist:::", isExist);

          if (isExist) {
            // return Promise.reject(
            //   "Email already exists, please use different email"
            // );
            throw new Error("Email already exists, please use different email");
          }
          return true;
        } else {
          return Promise.reject("Email required");
        }
      }),
    body("password", "Please enter a password with min length to 5").isLength({
      min: 5,
    }),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password have to match");
      }
      return true;
    }),
  ],
  postSignup
);

authRouter.post("/logout", isAuth, postLogout);

authRouter.get("/myProfile", isAuth, getProfile);

// router.post("/reset", postReset);

// router.post("/new-password", authController.postNewPassword);

export default authRouter;
