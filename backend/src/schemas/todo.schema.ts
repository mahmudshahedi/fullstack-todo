import { Schema, Document } from 'mongoose';
export interface Todo extends Document {
  name: string;
  task: string;
  status: number;
  completedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
export const TodoSchema = new Schema<Todo>({
  name: { type: String, required: true },
  task: { type: String, required: true },
  status: { type: Number, required: true },
  completedAt: { type: Date, required: false, default: null },
}, { timestamps: true });