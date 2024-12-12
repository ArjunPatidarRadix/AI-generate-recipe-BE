import express, { Express, NextFunction, Request, Response } from "express";
// import dotenv from "dotenv";
import recipeRoutes from "./routes/recipe.route";
import "dotenv/config";

// dotenv.config();

import "./db/MongoDb";
import authRouter from "./routes/auth.route";
import bodyParser from "body-parser";
import { intializeFirebase } from "./utils/firebase.config";

const app: Express = express();
const port = process.env.PORT || 3000;
console.log("process.env.PORT:: ", process.env.PORT);
// intializeFirebase();

app.use(bodyParser.json());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  // res.header(
  //   "Access-Control-Allow-Headers",
  //   "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  // );

  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// app.use(bodyParser.json());
app.use("/public", express.static("public"));

app.use("/api/user", authRouter);

app.use("/api", recipeRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the recipe generator app!");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
