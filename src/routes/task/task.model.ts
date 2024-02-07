import mongoose, { Schema, Document } from 'mongoose';
const inc = require('mongoose-sequence')(mongoose)

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  tags: string[];
  priority: 'high' | 'medium' | 'low';
  created_at: Date;
  updated_at?: Date;
}

const taskSchema: Schema<ITask & { id: number | string }> = new Schema({
  // id: { type: Number },
  title: { type: String, trim: true, required: true },
  description: String,
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  tags: { type: [String], default: [] },
  priority: { type: String, enum: ['high', 'medium', 'low'], required: true },
  created_at: { type: Date, default: new Date() },
  updated_at: Date,
}, { id: true });

// Add the auto-incrementing ID field
taskSchema.plugin(inc, { id: 'id', inc_field: 'id' }); // Specify the id for the sequence

const Task = mongoose.model<ITask & { id: number | string }>('Task', taskSchema);

export default Task;
