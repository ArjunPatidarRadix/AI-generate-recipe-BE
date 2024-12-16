"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import dotenv from "dotenv";
const recipe_route_1 = __importDefault(require("./routes/recipe.route"));
require("dotenv/config");
// dotenv.config();
require("./db/MongoDb");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
console.log("process.env.PORT:: ", process.env.PORT);
// intializeFirebase();
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    // res.header(
    //   "Access-Control-Allow-Headers",
    //   "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    // );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});
// app.use(bodyParser.json());
app.use("/public", express_1.default.static("public"));
app.use("/api/user", auth_route_1.default);
app.use("/api", recipe_route_1.default);
app.get("/", (req, res) => {
    res.send("Welcome to the recipe generator app!");
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
});
app.listen(3030, "0.0.0.0", () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
