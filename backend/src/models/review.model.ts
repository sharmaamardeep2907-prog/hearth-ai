import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  bookingId: mongoose.Types.ObjectId; customerId: mongoose.Types.ObjectId; providerId: mongoose.Types.ObjectId;
  rating: number; comment: string; title?: string; images?: string[];
  providerReply?: { comment: string; repliedAt: Date };
  helpfulVotes: { count: number; voters: mongoose.Types.ObjectId[] };
  status: "published"|"pending"|"flagged"|"removed";
  isDeleted: boolean;
}

const reviewSchema = new Schema<IReview>({
  bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true, unique: true },
  customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  providerId: { type: Schema.Types.ObjectId, ref: "Provider", required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, maxlength: 5000 },
  title: { type: String, maxlength: 200 },
  images: [{ type: String }],
  providerReply: { comment: String, repliedAt: Date },
  helpfulVotes: { count: { type: Number, default: 0 }, voters: [{ type: Schema.Types.ObjectId, ref: "User" }] },
  status: { type: String, enum: ["published","pending","flagged","removed"], default: "published" },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const Review = mongoose.model<IReview>("Review", reviewSchema);