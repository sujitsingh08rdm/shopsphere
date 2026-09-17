import MessageInterface from "@/interface/message.interface";
import { NextResponse as res } from "next/server";

const ServerCatchError = (err: unknown, status: number = 500) => {
  if (err instanceof Error) {
    return res.json({ message: err.message }, { status });
  }
   return res.json({ message: "Unknown Error" }, { status });
};

export default ServerCatchError;
