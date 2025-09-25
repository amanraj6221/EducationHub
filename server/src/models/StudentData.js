// server/src/models/StudentData.js
const mongoose = require("mongoose");

const studentDataSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // user collection se link
      required: true,
      unique: true, // ek student ka ek hi final portfolio hoga
    },

    // Final merged data (profile, education, documents, etc.)
    data: {
      type: Object,
      default: {},
    },

    files: {
      type: Object,
      default: {}, // StudentSection ke uploads bhi final me aa jayein
    },

    // Faculty status
    status: {
      type: String,
      enum: ["Not Submitted", "Pending", "Approved", "Rejected"],
      default: "Not Submitted",
    },

    remark: {
      type: String,
      default: "",
    },

    submittedAt: { type: Date },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentData", studentDataSchema);
