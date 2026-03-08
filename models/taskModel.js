const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: ObjectId,
      ref: "Project",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    assignedUser: {
      type: ObjectId,
      ref: "User",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Review", "Completed"],
      default: "Todo",
    },
    dueDate: { type: Date },
  },
  { timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task