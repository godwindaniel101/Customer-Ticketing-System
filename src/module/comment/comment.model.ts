import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { UserDocument } from "../auth/auth.model";
import { TicketDocument } from "../ticket/ticket.model";

export interface CommentDocument extends mongoose.Document {
  user: UserDocument["_id"];
  ticket:TicketDocument["_id"];
  title: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new mongoose.Schema(
  {
    CommentId: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(10),
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
    comment: { type: String, default: true },
  },
  { timestamps: true }
);

const Comment = mongoose.model<CommentDocument>("Comment", CommentSchema);

export default Comment;
