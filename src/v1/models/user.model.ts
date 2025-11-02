import { Schema, model, Document } from "mongoose";

export type Role = "buyer" | "vendor" | "mod" | "admin";
export type ModCategory = "editor" | "pr";

interface IUserDoc extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo?: number;
  country?: string;
  state?: string;
  stateOfOrigin?: string;
  passwordHash: string;
  role: Role;
  modCategory?: ModCategory[];
  vendorProfileId?: Schema.Types.ObjectId | null;
  createdAt: Date;
}

const UserSchema = new Schema<IUserDoc>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phoneNo: Number,
    country: String,
    state: String,
    stateOfOrigin: String,
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["buyer", "vendor", "mod", "admin"],
      default: "buyer",
      required: true,
    },
    modCategory: [
      {
        type: String,
        enum: ["editor", "pr"],
      },
    ],
    vendorProfileId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      default: null,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const UserModel = model<IUserDoc>("User", UserSchema);
