import { Router } from "express";
import multer from "multer";
import { isAuth } from "../middleware/isAuth";
import {
  generateRecipe,
  getRecipeById,
  getRecipies,
} from "../controllers/recipe.controller";

const router = Router();

const storage = multer.memoryStorage();

const upload = multer({ storage });

router.post("/recipe", isAuth, upload.single("image"), generateRecipe);

// GET: Fetch an recipe by ID
router.get("/recipe/:id", getRecipeById);

// GET: Fetch an recipe by ID
router.get("/recipes", isAuth, getRecipies);

export default router;
