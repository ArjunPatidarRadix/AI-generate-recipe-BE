import mongoose, { Schema, Document, Model } from "mongoose";
// import isEmail from "validator/lib/isEmail";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Define interface for user document

interface IToken {
  token: string;
  createdAt: Date;
}

export interface UserInterface extends IUserSchema {
  // declare any instance methods here
}

// Model is from mongoose.Model
interface UserModelInterface extends Model<UserInterface> {
  // declare any static methods here
  findByCredentials(email: string, password: string): Promise<IUserSchema>; // this should be changed to the correct return type if possible.
  isUserExist(email: string): boolean;
}

export interface IUserSchema extends Document {
  name: string;
  email: string;
  tokens: IToken[];
  password: string;
  generateAuthToken: () => string;
  resetToken: string;
  resetTokenExpiration: Date;
}

const TokenSchema: Schema = new Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Define Mongoose schema for user
const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 7,
      validate(value: string) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password can not contain "password"');
        }
      },
    },
    tokens: [TokenSchema],
    resetToken: String,
    resetTokenExpiration: Date,
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

UserSchema.statics.findByCredentials = async (
  email: string,
  password: string
): Promise<IUserSchema> => {
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error("Please enter the correct email");
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Please enter the correct password");
  }

  return user;
};

UserSchema.statics.isUserExist = async (email: string): Promise<boolean> => {
  const user = await User.findOne({ email: email });

  if (user) {
    return true;
  }
  return false;
};

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const pass = user.password;
    user.password = await bcrypt.hash(pass as string, 8);
  }
  next();
});

// Define and export User model
// export const User = mongoose.model<IUserSchema>("User", UserSchema);

export const User: UserModelInterface = mongoose.model<
  UserInterface,
  UserModelInterface
>("users", UserSchema);
