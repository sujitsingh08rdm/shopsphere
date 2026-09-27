const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
import mongoose from "mongoose";
mongoose.connect(db);

import ServerCatchError from "@/lib/server-catch-error";
import { NextRequest, NextResponse as res } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import CartModel from "@/models/cart.model";

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return res.json({ message: "unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "user") {
      return res.json({ message: "unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    body.user = session.user.id;

    const updated = await CartModel.findOneAndUpdate(
      {
        user: body.user,
        product: body.product,
      },
      { $inc: { quantity: 1 } },
      { new: true },
    );

    if (updated) {
      return res.json(updated);
    }

    const cart = await CartModel.create(body);
    return res.json(cart);
  } catch (error) {
    return ServerCatchError(error);
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return res.json({ message: "unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "user") {
      return res.json({ message: "unauthorized o" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    if (searchParams.get("count")) {
      const count = await CartModel.countDocuments({ user: session.user.id });
      return res.json({ count });
    }

    const carts = await CartModel.find({ user: session.user.id }).populate(
      "product",
    );
    return res.json(carts);
  } catch (error) {
    return ServerCatchError(error);
  }
};
