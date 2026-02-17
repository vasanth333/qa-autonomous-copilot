"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const analyzeRoute_js_1 = __importDefault(require("./routes/analyzeRoute.js"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api", analyzeRoute_js_1.default);
app.get("/", (_req, res) => {
    res.json({
        service: "QA Autonomous Copilot API",
        status: "Running",
        endpoints: {
            health: "/health",
            analyze: "POST /api/analyze"
        }
    });
});
app.get("/health", (_req, res) => {
    res.json({ status: "OK" });
});
// ✅ FIX: Use dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 QA Copilot API running on port ${PORT}`);
});
