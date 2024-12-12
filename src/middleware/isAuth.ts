import { NextFunction, Request, Response } from "express";
import { User } from "../models/UserModel";

import jwt, { JwtPayload } from "jsonwebtoken";

interface IJwtPayload extends JwtPayload {
  _id: string;
}

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as IJwtPayload;
    // console.log("decoded token: " + decoded);
    const user = await User.findOne({
      _id: decoded?._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }
    // console.log(token);
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "User not authorized" });
  }
};
