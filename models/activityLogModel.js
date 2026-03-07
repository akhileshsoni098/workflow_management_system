const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },

    // api call se pata chalega ki user ne kya action perform kiya hai
    actionType: {
      type: String,
      required: true,
    },

    entityType: {
      type: String,
      enum: ["Task", "Project"],
      required: true,
    },
    // jo action perform hui uska id hoga chahe wo task ho ya project
    entityId: {
      type: ObjectId,
      required: true,
    },
  },
  { timestamps: true },
);

const Activity = mongoose.model("ActivityLog", activitySchema);

module.exports = Activity;

/* 
Log fields:

Log ID

User ID

Action Type  (Task Created, Task Status Changed, Task Assigned,Project Created)

Entity Type (Task / Project)   

Entity ID  // project or task Id

Timestamp



*/
