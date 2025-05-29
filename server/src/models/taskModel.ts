import { Schema,Types,model } from "mongoose";

export interface ITask {
  title: string;
  description: string;
  listId: Types.ObjectId;
}

const taskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  listId: {
    type: Schema.Types.ObjectId,
    ref: "List",
    required: true, 
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

const Task = model<ITask>("Task", taskSchema);
export default Task;