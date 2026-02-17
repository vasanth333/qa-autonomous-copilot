import { Router } from "express";
import { runMultiAgentSystem } from "../orchestrator.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { analyzeSchema } from "../middleware/analyzeSchema.js";

const router = Router();

router.post(
  "/analyze",
  validateRequest(analyzeSchema),
  async (req, res) => {
    try {
      const { logs } = req.body;

      const result = await runMultiAgentSystem(logs);

      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("🚨 API ERROR:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error.",
      });
    }
  }
);

export default router;
