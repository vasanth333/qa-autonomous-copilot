"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareReports = compareReports;
function compareReports(previous, current) {
    if (!previous) {
        return "No historical data available. Baseline report created.";
    }
    const deltaCritical = current.criticalCount - previous.criticalCount;
    const deltaTotal = current.totalFailures - previous.totalFailures;
    if (deltaCritical > 0) {
        return `⚠️ CRITICAL failures increased by ${deltaCritical}. Immediate attention required.`;
    }
    if (deltaTotal > 0) {
        return `📈 Total failures increased by ${deltaTotal}. Monitor regression trend.`;
    }
    if (deltaTotal < 0) {
        return `✅ Failures decreased by ${Math.abs(deltaTotal)}. System stability improving.`;
    }
    return "No significant change compared to previous run.";
}
