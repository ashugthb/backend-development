import { Schema, model } from "mongoose";

const paymentStatusEnum = ["Pending", "Success", "Failed"];
const paymentModeEnum = ["Credit Card", "Debit Card", "Net Banking", "Wallet"];

const paymentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: paymentStatusEnum,
    default: "Pending",
  },
  gatewayResponse: {
    type: String,
    required: true,
  },
  paymentMode: {
    type: String,
    enum: paymentModeEnum,
    required: true,
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

const Payment = model("Payment", paymentSchema);

export default Payment;
