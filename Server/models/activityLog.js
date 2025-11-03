// models/ActivityLog.js
import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true }, // e.g., "Created Task", "Joined Team"
    entityType: { type: String, required: true }, // "Team" | "Project" | "Task"
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    description: { type: String }, // Human-readable text
  },
  { timestamps: true }
);

export default mongoose.model("ActivityLog", activityLogSchema);
