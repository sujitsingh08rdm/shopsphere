import mongoose, { Schema, model, models } from "mongoose";
import ProductModel from "./product.model";
import UserModel from "./user.model";

const cartSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: UserModel,
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: ProductModel,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);

const CartModel = models.Cart || model("Cart", cartSchema);

export default CartModel;
