import { NextFunction, Request, Response } from "express";

import bcrypt from "bcryptjs";
// import nodemailer from "nodemailer";
// import sendgridTransport from "nodemailer-sendgrid-transport";
import { validationResult } from "express-validator";
import { User } from "../models/UserModel";

// const transporter = nodemailer.createTransport(
//   sendgridTransport({
//     auth: {
//       api_key: process.env.SENDGRID_API_KEY,
//     },
//   })
// );

export const postLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
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
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    delete user.tokens;
    delete user.password;
    res.send({ message: "Login successful", data: { user, token } });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

export const postSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    const errors = validationResult(req);
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

    const user = new User({
      name: name,
      email: email,
      password: password,
    });

    await user.save();
    const token = await user.generateAuthToken();
    const data = JSON.parse(JSON.stringify(user));
    delete data.tokens;
    delete data.password;
    res.status(200).send({
      message: "Register successfull",
      data: { ...data, token },
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.send({ message: "Login successful", data: req.user });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const postLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const postNewPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
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
