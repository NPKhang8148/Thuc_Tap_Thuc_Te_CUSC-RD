// src/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

// Thêm swagger
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// ====== Kết nối MongoDB ======
connectDB();

const app = express();

// Xử lý CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
    ], // địa chỉ frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ====== Middleware ======

// app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ====== Swagger cấu hình ======
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Tài liệu API cho hệ thống",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // đường dẫn tới các route để swagger đọc JSDoc
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ====== Routes ======
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/admins", require("./routes/adminRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));

//CUSC RD
app.use("/api/softwares", require("./routes/softwareRoutes"));
app.use("/api/tools", require("./routes/toolRoutes"));
app.use("/api/seminars", require("./routes/seminarRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/stats", require("./routes/statsRoutes"));

// serve uploads
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// ====== 404 Not Found ======
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ====== Start Server ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📖 Swagger Docs: http://localhost:${PORT}/api-docs`);
});
