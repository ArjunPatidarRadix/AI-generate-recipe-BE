import mongoose, { Schema, Document } from "mongoose";

export interface IRecipe extends Document {
  name: string;
  imagePath: string;
  fileName: string;
  contentType: string;
  recipeName: string;
  recipeDetails: string;
  userId: mongoose.Schema.Types.ObjectId;
}

const RecipeSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    imagePath: { type: String, required: true },
    fileName: { type: String, required: true },
    contentType: { type: String, required: true },
    recipeName: { type: String, required: true },
    recipeDetails: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRecipe>("Recipe", RecipeSchema);
