import { Router, Request, Response } from 'express';

const router = Router();

router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { projectName, environment, failures } = req.body;

    if (
      !projectName ||
      !environment ||
      !Array.isArray(failures)
    ) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed'
      });
    }

    const normalizedFailures = failures.map((f: any) => ({
      testName: f.testName || 'Unknown Test',
      filePath: f.filePath || '',
      errorMessage: f.errorMessage || '',
      stackTrace: f.stackTrace || '',
      duration: f.duration || 0,
      status: f.status || 'failed'
    }));

    const riskScore = Math.min(100, normalizedFailures.length * 30);

    const severity =
      riskScore >= 80
        ? 'CRITICAL'
        : riskScore >= 50
        ? 'HIGH'
        : riskScore >= 20
        ? 'MEDIUM'
        : 'LOW';

    return res.json({
      success: true,
      projectName,
      environment,
      totalFailures: normalizedFailures.length,
      riskScore,
      severity,
      message: 'QA Copilot analysis complete'
    });

  } catch (error: any) {
    console.error('Analyze API error:', error);

    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
