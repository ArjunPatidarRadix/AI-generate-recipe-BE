import { NextFunction, Request, Response } from "express";
import Recipe from "../models/RecipeModel";
import { HfInference } from "@huggingface/inference";
import path from "path";
import fs from "fs";
import "dotenv/config";

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

const inference = new HfInference(HF_TOKEN);

// Initialize Cloud Storage and get a reference to the service
// firebaseApp;
// const storage = getStorage(firebaseApp);

export const generateRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const { buffer, mimetype, originalname } = req.file;

    // Save the file to disk manually in local storage
    const rootDir = path.resolve(__dirname, "../../");

    const uploadPath = path.join(rootDir, "public/uploads", originalname);

    console.log("uploadPath", uploadPath);
    fs.writeFileSync(uploadPath, buffer);

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
      let imageResult = await inference.imageToText({
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

      let recipe = await inference.textGeneration({
        model: textGenerationModel,
        inputs: `what is the detailed recipe for ${imageResult.generated_text}?`,
        max_tokens: 4096,
      });

      console.log("recipe::: ", recipe);

      // Output the generated response
      const newImage = new Recipe({
        name: originalname,
        imagePath: `public/uploads/${originalname}`,
        fileName: originalname,
        contentType: mimetype,
        recipeName: imageResult?.generated_text,
        recipeDetails: recipe?.generated_text?.replace(input, ""),
        userId: req.user._id,
      });

      await newImage.save();

      res.status(201).json({
        message: "Recipe generated successfully",
        data: {
          recipeName: imageResult.generated_text,
          recipe: recipe.generated_text?.replace(input, ""),
        },
      });
    } else {
      res
        .status(500)
        .json({ message: "Internal server errror, Please try again." });
      return;
    }
  } catch (error) {
    console.log("Error generating recipe: ", error);
    res.status(500).json({ message: "Error uploading image", error });
  }
};

export const getRecipeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const recipeData = await Recipe.findById(id);

    if (!recipeData) {
      res.status(404).json({ message: "Recipe not found" });
      return;
    }

    res.status(200).json({
      message: "Recipe fetched",
      data: recipeData,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipe", error });
  }
};

export const getRecipies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recipesData = await Recipe.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    if (!recipesData) {
      res.status(404).json({ message: "Recipe not found" });
      return;
    }

    res.status(200).json({
      message: recipesData?.length
        ? "Recipe fetched"
        : "No recipes found for this user",
      data: recipesData,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipe", error });
  }
};
