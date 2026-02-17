import "dotenv/config";
import express from "express";
import analyzeRoute from "./routes/analyzeRoute.js";

const app = express();

app.use(express.json());
app.use("/api", analyzeRoute);

app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

// ✅ FIX: Use dynamic port for Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 QA Copilot API running on port ${PORT}`);
});
