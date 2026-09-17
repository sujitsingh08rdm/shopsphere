import ServerCatchError from "@/lib/server-catch-error";
import { NextRequest, NextResponse as res } from "next/server";

import mongoose from "mongoose";
mongoose.connect(process.env.DB!);
import ProductModel from "@/models/product.model";
import SlugInterface from "@/interface/slug.interface";

export const GET = async (req: NextRequest, context: SlugInterface) => {
  try {
    const { slug } = await context.params;

    const product = await ProductModel.findOne({ slug });
    if (!product) {
      return res.json(
        { message: "Product not found with slug" },
        { status: 404 },
      );
    }

    return res.json(product);
  } catch (error) {
    return ServerCatchError(error);
  }
};

export const PUT = async (req: NextRequest, context: SlugInterface) => {
  try {
    const { slug: id } = await context.params;
    const body = await req.json();

    const product = await ProductModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!product) {
      return res.json(
        { message: "Product not found with slug" },
        { status: 404 },
      );
    }

    return res.json(product);
  } catch (error) {
    return ServerCatchError(error);
  }
};

export const DELETE = async (req: NextRequest, context: SlugInterface) => {
  try {
    const { slug: id } = await context.params;
    const product = await ProductModel.findByIdAndUpdate(id);

    if (!product) {
      return res.json(
        { message: "Product not found with slug" },
        { status: 404 },
      );
    }

    return res.json(product);
  } catch (error) {
    return ServerCatchError(error);
  }
};
