// C:\Users\Aman Raj\EducationHub\server\src\routes\pdf.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const puppeteer = require("puppeteer");
const StudentData = require("../models/StudentData");

// Ensure uploads/pdfs folder exists
const pdfDir = path.join(__dirname, "../../uploads/pdfs");
if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

/**
 * POST /api/pdf/generate
 * body: { studentId, templateId }
 * Returns: { success: true, pdfLink }
 */
router.post("/generate", async (req, res) => {
  try {
    const { studentId, templateId } = req.body;
    if (!studentId)
      return res
        .status(400)
        .json({ success: false, message: "studentId required" });

    const studentData = await StudentData.findOne({ studentId }).lean();
    if (!studentData)
      return res
        .status(404)
        .json({ success: false, message: "No student data found" });

    // Simple HTML generator: use templateId to choose different styles
    const template =
      templateId === "template-2"
        ? template2(studentData)
        : template1(studentData);

    // Launch puppeteer and render pdf
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(template, { waitUntil: "networkidle0" });

    const fileName = `portfolio_${studentId}_${Date.now()}.pdf`;
    const filePath = path.join(pdfDir, fileName);

    await page.pdf({ path: filePath, format: "A4", printBackground: true });
    await browser.close();

    // Save pdfLink to StudentData doc
    await StudentData.findOneAndUpdate(
      { studentId },
      { $set: { pdfLink: `/uploads/pdfs/${fileName}`, updatedAt: new Date() } }
    );

    res.json({ success: true, pdfLink: `/uploads/pdfs/${fileName}` });
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ success: false, message: "PDF generation failed" });
  }
});

// basic template functions
function template1(data) {
  const name = data.sections?.profile?.name || "Student";
  // very simple HTML - you can improve CSS per template
  return `<!doctype html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <title>Portfolio</title>
    <style>
      body{ font-family: Arial, Helvetica, sans-serif; padding: 24px; color:#111 }
      h1{ font-size: 24px; margin-bottom: 8px }
      .section{ margin-bottom: 12px }
      .label{ font-weight: 700 }
    </style>
  </head>
  <body>
    <h1>${name} — E-Portfolio</h1>
    <div class="section"><div class="label">Profile:</div><pre>${JSON.stringify(data.sections?.profile || {}, null, 2)}</pre></div>
    <div class="section"><div class="label">Education:</div><pre>${JSON.stringify(data.sections?.education || {}, null, 2)}</pre></div>
    <div class="section"><div class="label">Experience:</div><pre>${JSON.stringify(data.sections?.experience || {}, null, 2)}</pre></div>
    <div class="section"><div class="label">Skills:</div><pre>${JSON.stringify(data.sections?.skills || {}, null, 2)}</pre></div>
  </body>
  </html>`;
}

function template2(data) {
  const name = data.sections?.profile?.name || "Student";
  return `<!doctype html>
  <html><head><meta charset="utf-8"/><title>Portfolio</title>
  <style>body{font-family: Helvetica; padding:30px; background:#f4f6f8} .card{background:#fff;padding:20px;border-radius:8px;}</style>
  </head><body><div class="card"><h1>${name}</h1>
  <h3>Education</h3><pre>${JSON.stringify(data.sections?.education || {}, null, 2)}</pre>
  <h3>Projects</h3><pre>${JSON.stringify(data.sections?.projects || {}, null, 2)}</pre>
  </div></body></html>`;
}

module.exports = router;
