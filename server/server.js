// C:\Aman Raj\EduSangrah\server\server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const app = express();

// ------------------ Middleware ------------------
app.use(cors());
app.use(express.json());

// ------------------ Routes ------------------
const authRoutes = require("./src/routes/auth"); // Auth routes
const facultyRoutes = require("./src/routes/faculty"); // Faculty routes
const studentRoutes = require("./src/routes/student"); // Student section save
const portfolioRoutes = require("./src/routes/portfolio"); // Portfolio routes
const pdfRoutes = require("./src/routes/pdf");
app.use("/api/pdf", pdfRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/portfolio", portfolioRoutes);

// ------------------ Server & Socket.io Setup ------------------
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", // frontend origin
    methods: ["GET", "POST"],
  },
});

// Make io available inside routes (via req.app.get("io"))
app.set("io", io);

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// ------------------ MongoDB Connection ------------------
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/edusangrah";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    server.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ------------------ Default Route ------------------
app.get("/", (req, res) => {
  res.send("EduSangrah Backend is running ✅");
});
