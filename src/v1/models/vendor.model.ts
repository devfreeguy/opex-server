import { Schema, model, Document } from "mongoose";

interface IVendor extends Document {
  userId: Schema.Types.ObjectId;
  businessName: string;
  bio?: string;
  logoUrl?: string;
  coverPicUrl?: string;
  active: boolean;
}

const VendorSchema = new Schema<IVendor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    businessName: { type: String, required: true },
    bio: String,
    logoUrl: String,
    coverPicUrl: String,
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const VendorModel = model<IVendor>("Vendor", VendorSchema);
