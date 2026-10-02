import mongoose from "mongoose";
const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
mongoose.connect(db);

import ServerCatchError from "@/lib/server-catch-error";
import UserModel from "@/models/user.model";

import { NextRequest, NextResponse as res } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export const PUT = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return res.json({ message: "unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "user") {
      return res.json({ message: "unauthorized" }, { status: 401 });
    }

    const id = session.user.id;
    const body = await req.json();
    delete body.passowrd;
    delete body.email;
    delete body.role;

    const user = await UserModel.findByIdAndUpdate(id, body);

    if (!user) {
      return res.json({ message: "User not found :(" }, { status: 404 });
    }
    return res.json({ message: "Changes Made Successfully" });
  } catch (error) {
    return ServerCatchError(error);
  }
};
