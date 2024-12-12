"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const isAuth_1 = require("../middleware/isAuth");
const recipe_controller_1 = require("../controllers/recipe.controller");
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
router.post("/recipe", isAuth_1.isAuth, upload.single("image"), recipe_controller_1.generateRecipe);
// GET: Fetch an recipe by ID
router.get("/recipe/:id", recipe_controller_1.getRecipeById);
// GET: Fetch an recipe by ID
router.get("/recipes", isAuth_1.isAuth, recipe_controller_1.getRecipies);
exports.default = router;
