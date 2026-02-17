"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orchestrator_js_1 = require("../orchestrator.js");
const validateRequest_js_1 = require("../middleware/validateRequest.js");
const analyzeSchema_js_1 = require("../middleware/analyzeSchema.js");
const router = (0, express_1.Router)();
router.post("/analyze", (0, validateRequest_js_1.validateRequest)(analyzeSchema_js_1.analyzeSchema), async (req, res) => {
    try {
        const { logs } = req.body;
        const result = await (0, orchestrator_js_1.runMultiAgentSystem)(logs);
        return res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error("🚨 API ERROR:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error.",
        });
    }
});
exports.default = router;
