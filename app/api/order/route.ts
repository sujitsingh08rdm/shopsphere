const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
import mongoose from "mongoose";
mongoose.connect(db);

import ServerCatchError from "@/lib/server-catch-error";
import { NextRequest, NextResponse as res } from "next/server";
import OrderModel from "@/models/order.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return res.json({ message: "unauthorized" }, { status: 401 });
    }

    if (session.user.role === "user") {
      return res.json({ message: "unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    body.user = session.user.id;
    const order = await OrderModel.create(body);
    return res.json(order);
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

    let orders = [];
    const role = session.user.role;
    const id = session.user.id;

    if (role === "user") {
      orders = await OrderModel.find({ user: id })
        .sort({ createdAt: -1 })
        .populate("product");
    }

    if (role === "admin") {
      orders = await OrderModel.find()
        .sort({ createdAt: -1 })
        .populate("user", "fullname email mobile")
        .populate("product");
    }

    return res.json(orders);
  } catch (error) {
    return ServerCatchError(error);
  }
};
