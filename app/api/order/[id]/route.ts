const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
import mongoose from "mongoose";
mongoose.connect(db);

import ServerCatchError from "@/lib/server-catch-error";
import { NextRequest, NextResponse as res } from "next/server";
import OrderModel from "@/models/order.model";
import IdInterface from "@/interface/id.interface";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export const PUT = async (req: NextRequest, context: IdInterface) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return res.json({ message: "unauthorized user" }, { status: 401 });
    }

    if (session.user.role === "user") {
      return res.json({ message: "unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const order = await OrderModel.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true },
    );
    if (!order) {
      return res.json({ message: "Order Not Found" }, { status: 404 });
    }
    return res.json(order);
  } catch (error) {
    return ServerCatchError(error);
  }
};
