// server/src/routes/portfolio.js
const express = require("express");
const router = express.Router();
const StudentData = require("../models/StudentData");
const StudentSection = require("../models/StudentSection");

// ==========================
// Student: Final Submit Portfolio
// ==========================
router.post("/submit", async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ message: "studentId is required" });
    }

    // 1. Collect all drafts (StudentSection)
    const sections = await StudentSection.find({ studentId });
    const mergedData = {};
    const mergedFiles = {};

    sections.forEach((sec) => {
      mergedData[sec.sectionId] = sec.data || {};
      mergedFiles[sec.sectionId] = sec.files || {};
    });

    // 2. Upsert into StudentData (final portfolio)
    let portfolio = await StudentData.findOne({ studentId });
    if (!portfolio) {
      portfolio = new StudentData({
        studentId,
        data: mergedData,
        files: mergedFiles,
        status: "Pending",
        submittedAt: new Date(),
      });
    } else {
      portfolio.data = mergedData;
      portfolio.files = mergedFiles;
      portfolio.status = "Pending";
      portfolio.submittedAt = new Date();
    }

    await portfolio.save();

    // 3. Emit socket event
    try {
      const io = req.app.get("io");
      if (io) {
        io.emit("portfolio_update", {
          event: "submitted",
          studentId,
          portfolioId: portfolio._id,
          status: portfolio.status,
          submittedAt: portfolio.submittedAt,
        });
      }
    } catch (e) {
      console.warn("Socket emit failed:", e.message || e);
    }

    return res.json({
      message: "Portfolio submitted successfully",
      portfolio,
    });
  } catch (err) {
    console.error("Portfolio submit error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// Faculty: Approve Portfolio
// ==========================
router.post("/approve", async (req, res) => {
  try {
    const { studentId, remark } = req.body;
    if (!studentId)
      return res.status(400).json({ message: "studentId is required" });

    const portfolio = await StudentData.findOne({ studentId });
    if (!portfolio)
      return res.status(404).json({ message: "Portfolio not found" });

    portfolio.status = "Approved";
    portfolio.remark = remark || "";
    portfolio.approvedAt = new Date();
    await portfolio.save();

    try {
      const io = req.app.get("io");
      if (io) {
        io.emit("portfolio_update", {
          event: "approved",
          studentId,
          portfolioId: portfolio._id,
          status: portfolio.status,
          remark,
        });
      }
    } catch (e) {
      console.warn("Socket emit failed:", e.message || e);
    }

    return res.json({ message: "Portfolio approved successfully", portfolio });
  } catch (err) {
    console.error("Portfolio approve error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// Faculty: Reject Portfolio
// ==========================
router.post("/reject", async (req, res) => {
  try {
    const { studentId, remark } = req.body;
    if (!studentId)
      return res.status(400).json({ message: "studentId is required" });

    const portfolio = await StudentData.findOne({ studentId });
    if (!portfolio)
      return res.status(404).json({ message: "Portfolio not found" });

    portfolio.status = "Rejected";
    portfolio.remark = remark || "";
    portfolio.rejectedAt = new Date();
    await portfolio.save();

    try {
      const io = req.app.get("io");
      if (io) {
        io.emit("portfolio_update", {
          event: "rejected",
          studentId,
          portfolioId: portfolio._id,
          status: portfolio.status,
          remark,
        });
      }
    } catch (e) {
      console.warn("Socket emit failed:", e.message || e);
    }

    return res.json({ message: "Portfolio rejected successfully", portfolio });
  } catch (err) {
    console.error("Portfolio reject error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// Faculty: Get All Pending Portfolios
// ==========================
router.get("/pending", async (req, res) => {
  try {
    const pendingPortfolios = await StudentData.find({
      status: "Pending",
    }).populate("studentId");
    return res.json({ portfolios: pendingPortfolios });
  } catch (err) {
    console.error("Get pending portfolio error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// Faculty: Get All Approved Portfolios
// ==========================
router.get("/approved", async (req, res) => {
  try {
    const approvedPortfolios = await StudentData.find({
      status: "Approved",
    }).populate("studentId");
    return res.json({ portfolios: approvedPortfolios });
  } catch (err) {
    console.error("Get approved portfolio error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// Student: Get Own Portfolio Status
// ==========================
router.get("/status/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const portfolio = await StudentData.findOne({ studentId });
    if (!portfolio) return res.json({ status: "Not Submitted" });
    return res.json({
      status: portfolio.status,
      remark: portfolio.remark || "",
    });
  } catch (err) {
    console.error("Get portfolio status error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
