import mongoose, { Schema, Document } from "mongoose";

export interface IProvider extends Document {
  userId: mongoose.Types.ObjectId; businessName: string; slug: string; category: string;
  subcategories: string[]; title: string; bio: string; description: string;
  services: { name: string; description: string; price: number; priceType: "fixed"|"hourly"|"estimate"; duration: number; includes: string[]; isActive: boolean }[];
  portfolio: { title: string; description: string; images: string[]; category: string }[];
  availability: { day: string; slots: { start: string; end: string }[]; isAvailable: boolean }[];
  addresses: { label: string; street: string; city: string; state: string; pincode: string; coordinates: { lat: number; lng: number }; isDefault: boolean }[];
  verification: { identity: boolean; address: boolean; business: boolean };
  ratings: { average: number; count: number; breakdown: Record<number,number> };
  stats: { totalJobs: number; completedJobs: number; totalEarnings: number };
  performance: { score: number; tier: "bronze"|"silver"|"gold"|"platinum" };
  walletBalance: number; commission: number;
  isVerified: boolean; isFeatured: boolean; isActive: boolean; isDeleted: boolean;
}

const providerSchema = new Schema<IProvider>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  businessName: { type: String, required: true },
  slug: { type: String, unique: true, required: true, lowercase: true, index: true },
  category: { type: String, required: true, index: true },
  subcategories: [{ type: String }],
  title: { type: String }, bio: { type: String }, description: { type: String },
  services: [{ name: String, description: String, price: Number, priceType: { type: String, enum: ["fixed","hourly","estimate"], default: "fixed" }, duration: { type: Number, default: 60 }, includes: [String], isActive: { type: Boolean, default: true } }],
  portfolio: [{ title: String, description: String, images: [String], category: String }],
  availability: [{ day: String, slots: [{ start: String, end: String }], isAvailable: { type: Boolean, default: true } }],
  addresses: [{ label: String, street: String, city: String, state: String, pincode: String, coordinates: { lat: Number, lng: Number }, isDefault: { type: Boolean, default: false } }],
  verification: { identity: { type: Boolean, default: false }, address: { type: Boolean, default: false }, business: { type: Boolean, default: false } },
  ratings: { average: { type: Number, default: 0 }, count: { type: Number, default: 0 }, breakdown: { type: Map, of: Number, default: {} } },
  stats: { totalJobs: { type: Number, default: 0 }, completedJobs: { type: Number, default: 0 }, totalEarnings: { type: Number, default: 0 } },
  performance: { score: { type: Number, default: 0 }, tier: { type: String, enum: ["bronze","silver","gold","platinum"], default: "bronze" } },
  walletBalance: { type: Number, default: 0 },
  commission: { type: Number, default: 15 },
  isVerified: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

providerSchema.index({ category: 1, isActive: 1, isVerified: 1 });
providerSchema.index({ "addresses.coordinates": "2dsphere" });
providerSchema.index({ slug: 1, isDeleted: 1 });

export const Provider = mongoose.model<IProvider>("Provider", providerSchema);