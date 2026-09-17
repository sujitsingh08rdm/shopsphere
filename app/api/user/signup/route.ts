import ServerCatchError from "@/lib/server-catch-error";
import { NextRequest, NextResponse as res } from "next/server";
import UserModel from "@/models/user.model";

import mongoose from "mongoose";
mongoose.connect(process.env.DB!);

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    await UserModel.create(body);

    return res.json({ message: "Signup successfull" });
  } catch (error) {
    return ServerCatchError(error);
  }
};
