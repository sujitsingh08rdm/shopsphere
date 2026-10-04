const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
import mongoose from "mongoose";
mongoose.connect(db);

import ProductModel from "@/models/product.model";

export const fetchProducts = async (page: number = 1, limit: number = 16) => {
  const skip = (page - 1) * limit;
  const total = await ProductModel.countDocuments();
  const data = await ProductModel.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return { total, data: data };
};

export const fetchProductSlugs = async () => {
  const slugs = await ProductModel.distinct("slug");
  return slugs;
};

export const fetchProductBySlug = async (slug: any) => {
  const product = await ProductModel.findOne({ slug });
  return product;
};
