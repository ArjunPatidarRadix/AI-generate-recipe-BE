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
exports.getRecipies = exports.getRecipeById = exports.generateRecipe = void 0;
const RecipeModel_1 = __importDefault(require("../models/RecipeModel"));
const inference_1 = require("@huggingface/inference");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
require("dotenv/config");
// import {
//   getStorage,
//   ref,
//   getDownloadURL,
//   uploadBytesResumable,
// } from "firebase/storage";
// import { firebaseApp, intializeFirebase } from "../utils/firebase.config";
const imageToTextModel = "nlpconnect/vit-gpt2-image-captioning";
const textGenerationModel = "Qwen/Qwen2.5-Coder-32B-Instruct";
// const HF_TOKEN = "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";
const HF_TOKEN = process.env.HF_TOKEN;
const inference = new inference_1.HfInference(HF_TOKEN);
// Initialize Cloud Storage and get a reference to the service
// firebaseApp;
// const storage = getStorage(firebaseApp);
const generateRecipe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        const { buffer, mimetype, originalname } = req.file;
        // Save the file to disk manually in local storage
        const rootDir = path_1.default.resolve(__dirname, "../../");
        const uploadPath = path_1.default.join(rootDir, "public/uploads", originalname);
        console.log("uploadPath", uploadPath);
        fs_1.default.writeFileSync(uploadPath, buffer);
        // const storageRef = ref(storage, `files/${req.file.originalname}`);
        // Create file metadata including the content type
        // const metadata = {
        //   contentType: req.file.mimetype,
        // };
        // // Upload the file in the bucket storage
        // const snapshot = await uploadBytesResumable(
        //   storageRef,
        //   req.file.buffer,
        //   metadata
        // );
        // //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel
        // // Grab the public url
        // const downloadURL = await getDownloadURL(snapshot.ref);
        // console.log("downloadURL:: ", downloadURL);
        if (buffer) {
            let imageResult = yield inference.imageToText({
                data: buffer,
                model: imageToTextModel,
            });
            console.log("imageResult: ", imageResult);
            // const prompt =
            //   "what is the detailed recipe for a pizza with olives, tomatoes, and cheese?";
            // const messages = [
            //   {
            //     role: "system",
            //     content:
            //       "you are elite chife who knows every single recipe and can answer it with easy to follow detailed steps.",
            //   },
            //   { role: "user", content: prompt },
            // ];
            const input = `what is the detailed recipe for ${imageResult.generated_text}?`;
            let recipe = yield inference.textGeneration({
                model: textGenerationModel,
                inputs: `what is the detailed recipe for ${imageResult.generated_text}?`,
                max_tokens: 4096,
            });
            console.log("recipe::: ", recipe);
            // Output the generated response
            const newImage = new RecipeModel_1.default({
                name: originalname,
                imagePath: `public/uploads/${originalname}`,
                fileName: originalname,
                contentType: mimetype,
                recipeName: imageResult === null || imageResult === void 0 ? void 0 : imageResult.generated_text,
                recipeDetails: (_a = recipe === null || recipe === void 0 ? void 0 : recipe.generated_text) === null || _a === void 0 ? void 0 : _a.replace(input, ""),
                userId: req.user._id,
            });
            yield newImage.save();
            res.status(201).json({
                message: "Recipe generated successfully",
                data: {
                    recipeName: imageResult.generated_text,
                    recipe: (_b = recipe.generated_text) === null || _b === void 0 ? void 0 : _b.replace(input, ""),
                },
            });
        }
        else {
            res
                .status(500)
                .json({ message: "Internal server errror, Please try again." });
            return;
        }
    }
    catch (error) {
        console.log("Error generating recipe: ", error);
        res.status(500).json({ message: "Error uploading image", error });
    }
});
exports.generateRecipe = generateRecipe;
const getRecipeById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const recipeData = yield RecipeModel_1.default.findById(id);
        if (!recipeData) {
            res.status(404).json({ message: "Recipe not found" });
            return;
        }
        res.status(200).json({
            message: "Recipe fetched",
            data: recipeData,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching recipe", error });
    }
});
exports.getRecipeById = getRecipeById;
const getRecipies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipesData = yield RecipeModel_1.default.find({ userId: req.user.id });
        if (!recipesData) {
            res.status(404).json({ message: "Recipe not found" });
            return;
        }
        res.status(200).json({
            message: (recipesData === null || recipesData === void 0 ? void 0 : recipesData.length)
                ? "Recipe fetched"
                : "No recipes found for this user",
            data: recipesData,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching recipe", error });
    }
});
exports.getRecipies = getRecipies;
