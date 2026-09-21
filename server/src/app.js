const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const memberRoutes = require("./routes/memberRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const heroSlideRoutes = require("./routes/heroSlideRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const path = require("path");
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/hero-slides", heroSlideRoutes);

app.use("/api/galleries", galleryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);



app.use("/uploads", express.static("uploads"));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "MMICS API is running",
  });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MMICS API is running",
  });
});

module.exports = app;