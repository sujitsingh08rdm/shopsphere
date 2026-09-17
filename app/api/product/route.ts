import ServerCatchError from "@/lib/server-catch-error";
import { NextRequest, NextResponse as res } from "next/server";

import mongoose from "mongoose";
import ProductModel from "@/models/product.model";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs";

mongoose.connect(process.env.DB!);

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.formData();
    const file = body.get("image") as File | null;

    if (!file) {
      return res.json({ message: "File Not Found" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const root = process.cwd();
    const folder = path.join(root, "public", "products");
    const fileName = `${uuid()}.png`;
    const filePath = path.join(folder, fileName);

    fs.writeFileSync(filePath, buffer);

    const payload = {
      title: body.get("title"),
      description: body.get("description"),
      price: body.get("price"),
      discount: body.get("discount"),
      image: `/products/${fileName}`,
    };

    const product = await ProductModel.create(payload);
    return res.json(product);
  } catch (error) {
    return ServerCatchError(error);
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (slug) {
      const slugs = await ProductModel.distinct("slug");

      return res.json(slugs);
    }

    const products = await ProductModel.find();
    return res.json(products);
  } catch (error) {
    return ServerCatchError(error);
  }
};
