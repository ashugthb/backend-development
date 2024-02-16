import { Schema, model } from "mongoose";

const productCategoryEnum = ["Namkeen", "Nuts", "Pickles", "Oils"];

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: String,
  category: {
    type: String,
    enum: productCategoryEnum,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  updationDate: {
    type: Date,
    default: Date.now,
  },
});

const Product = model("Product", productSchema);

export default Product;
