import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true, discount: 0 },
    image: { type: String, required: true },
    slug: { type: String },
  },
  { timestamps: true },
);

productSchema.pre("save", function () {
  this.slug = this.title.toLowerCase().split(" ").join("-");
});

const ProductModel = models.Product || model("Product", productSchema);
export default ProductModel;
