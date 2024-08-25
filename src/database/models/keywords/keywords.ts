import mongoose, { Schema, model } from "mongoose";

const keywordSchema = new Schema({
  name: String,
  description: String,
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const Keyword = model("Keyword", keywordSchema, "Keywords");

export default Keyword;
