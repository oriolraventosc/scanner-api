import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: String,
  image: String,
  ingredients: String,
  description: String,
  brand: [String],
  weight: Number,
  benefits: [String],
  ean: String,
  status: String,
  howToUse: String,
  sideEffects: String,
  keywords: [String],
  keywordsWithDescription: [{ name: String, description: String }],
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const Product = model("Product", productSchema, "Products");

export default Product;
