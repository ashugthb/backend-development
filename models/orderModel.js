import { Schema, model } from "mongoose";

const orderStatusEnum = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderStatus: {
    type: String,
    enum: orderStatusEnum,
    default: "Pending",
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, default: 1 },
    },
  ],
  creationDate: {
    type: Date,
    default: Date.now,
  },
  updationDate: {
    type: Date,
    default: Date.now,
  },
});

const Order = model("Order", orderSchema);

export default Order;
