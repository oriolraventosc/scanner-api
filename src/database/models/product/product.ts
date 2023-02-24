import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: String,
  image: String,
  price: Number,
  ingredients: String,
  brand: String,
  weight: Number,
  benefits: [String],
  ean: String,
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const Product = model("Product", productSchema, "Products");

export default Product;
