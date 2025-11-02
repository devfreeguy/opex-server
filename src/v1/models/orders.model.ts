import { Schema, model, Document } from "mongoose";

interface IOrder extends Document {
  buyerId: Schema.Types.ObjectId;
  items: {
    productId: Schema.Types.ObjectId;
    vendorId: Schema.Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  total: number;
  currency: string;
  status:
    | "pending"
    | "paid"
    | "shipped"
    | "completed"
    | "cancelled"
    | "refunded";
  createdAt: Date;
  transactionId?: string;
}

const OrderSchema = new Schema<IOrder>(
  {
    buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        vendorId: { type: Schema.Types.ObjectId, ref: "Vendor" },
        quantity: Number,
        price: Number,
      },
    ],
    total: Number,
    currency: { type: String, default: "USD" },
    status: { type: String, default: "pending" },
    transactionId: String,
  },
  { timestamps: true }
);

export const OrderModel = model<IOrder>("Order", OrderSchema);
