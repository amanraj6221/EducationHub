// C:\Aman Raj\EduSangrah\server\src\models\StudentSection.js
const mongoose = require("mongoose");

const studentSectionSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  sectionId: { type: String, required: true },
  data: { type: Object, default: {} },
  files: { type: Object, default: {} },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("StudentSection", studentSectionSchema);
