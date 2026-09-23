const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
import ServerCatchError from "@/lib/server-catch-error";
import UserModel from "@/models/user.model";
import mongoose from "mongoose";
mongoose.connect(db);

import { NextRequest, NextResponse as res } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const GET = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return res.json({ message: "unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return res.json({ message: "unauthorized" }, { status: 401 });
    }
    const user = await UserModel.find({ role: "user" }, { password: 0 }).sort({
      createdAt: -1,
    });
    return res.json(user);
  } catch (error) {
    return ServerCatchError(error);
  }
};
