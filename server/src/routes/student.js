// C:\Aman Raj\EduSangrah\server\src\routes\student.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const StudentSection = require("../models/StudentSection");

const router = express.Router();

// ------------------ Multer Setup ------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads")); // uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ------------------ POST: Save Section Data ------------------
router.post(
  "/section/save",
  upload.any(), // handle all file uploads
  async (req, res) => {
    try {
      const { studentId, sectionId, data } = req.body;

      if (!studentId || !sectionId) {
        return res
          .status(400)
          .json({ success: false, message: "studentId & sectionId required" });
      }

      const parsedData = data ? JSON.parse(data) : {};

      // Collect uploaded files
      const files = {};
      if (req.files) {
        req.files.forEach((file) => {
          files[file.fieldname] = file.path;
        });
      }

      // Upsert into DB
      const section = await StudentSection.findOneAndUpdate(
        { studentId, sectionId },
        { data: parsedData, files, updatedAt: Date.now() },
        { new: true, upsert: true }
      );

      res.json({ success: true, message: "Draft saved ✅", section });
    } catch (err) {
      console.error("❌ Save draft error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// ------------------ GET: Fetch Section Data ------------------
router.get("/section/:sectionId/:studentId", async (req, res) => {
  try {
    const { sectionId, studentId } = req.params;

    const section = await StudentSection.findOne({ studentId, sectionId });

    if (!section) {
      return res.json({
        success: true,
        data: null,
        message: "No data found",
      });
    }

    res.json({
      success: true,
      data: section.data,
      files: section.files,
    });
  } catch (err) {
    console.error("❌ Fetch section error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
