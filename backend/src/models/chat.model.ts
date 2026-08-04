import mongoose, { Schema, Document } from "mongoose";

export interface IChatRoom extends Document {
  participants: mongoose.Types.ObjectId[]; bookingId?: mongoose.Types.ObjectId;
  lastMessage?: { senderId: mongoose.Types.ObjectId; content: string; type: string; sentAt: Date };
  unreadCount: Map<string,number>; isArchived: boolean;
}

const chatRoomSchema = new Schema<IChatRoom>({
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
  lastMessage: { senderId: Schema.Types.ObjectId, content: String, type: String, sentAt: Date },
  unreadCount: { type: Map, of: Number, default: new Map() },
  isArchived: { type: Boolean, default: false },
}, { timestamps: true });

chatRoomSchema.index({ participants: 1 });

export const ChatRoom = mongoose.model<IChatRoom>("ChatRoom", chatRoomSchema);