const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
import mongoose from "mongoose";
mongoose.connect(db);

import ServerCatchError from "@/lib/server-catch-error";
import { NextRequest, NextResponse as res } from "next/server";
import { getServerSession } from "next-auth";
import CartModel from "@/models/cart.model";
import { authOptions } from "../../auth/[...nextauth]/route";
import IdInterface from "@/interface/id.interface";

export const PUT = async (req: NextRequest, context: IdInterface) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return res.json({ message: "unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "user") {
      return res.json({ message: "unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();

    let cart = null;

    if (body.quantity > 0) {
      cart = await CartModel.findByIdAndUpdate(
        id,
        { quantity: body.quantity },
        { new: true },
      );
    } else {
      cart = await CartModel.findByIdAndDelete(id);
    }

    if (!cart) {
      return res.json({ message: "cart not found" }, { status: 404 });
    }

    return res.json(cart);
  } catch (error) {
    return ServerCatchError(error);
  }
};

export const DELETE = async (req: NextRequest, context: IdInterface) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return res.json({ message: "unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "user") {
      return res.json({ message: "unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const cart = await CartModel.findByIdAndDelete(id);

    if (!cart) {
      return res.json({ message: "cart not found" }, { status: 404 });
    }

    return res.json(cart);
  } catch (error) {
    return ServerCatchError(error);
  }
};
