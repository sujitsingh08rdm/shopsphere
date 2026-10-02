const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
import ServerCatchError from "@/lib/server-catch-error";
import UserModel from "@/models/user.model";
import mongoose from "mongoose";
mongoose.connect(db);

import { NextRequest, NextResponse as res } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import IdInterface from "@/interface/id.interface";

export const PUT = async (req: NextRequest, context: IdInterface) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return res.json({ message: "unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return res.json({ message: "unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const body = await req.json();
    await UserModel.updateOne({ _id: id }, { role: body.role });
    return res.json({ message: "Role Updated" });
  } catch (error) {
    return ServerCatchError(error);
  }
};
