const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
import mongoose from "mongoose";
mongoose.connect(db);

import ServerCatchError from "@/lib/server-catch-error";
import { NextRequest, NextResponse as res } from "next/server";
import PaymentModel from "@/models/payment.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const payment = await PaymentModel.create(body);
    return res.json(payment);
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

    if (session.user.role === "user") {
      return res.json({ message: "unauthorized" }, { status: 401 });
    }

    const payments = await PaymentModel.find()
      .sort({ createdAt: -1 })
      .populate("user", "fullname email")
      .populate({
        path: "order",
        populate: { path: "product", model: "Product" },
      });

    return res.json(payments);
  } catch (error) {
    return ServerCatchError(error);
  }
};
