import { Schema, model, Document } from "mongoose";

interface IProduct extends Document {
  vendorId: Schema.Types.ObjectId;
  name: string;
  description?: string;
  price: number; // store in cents or smallest currency unit
  currency: string;
  images: string[];
  stock: number;
  categories: string[];
  active: boolean;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    images: [String],
    stock: { type: Number, default: 0 },
    categories: [String],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ProductModel = model<IProduct>("Product", ProductSchema);
