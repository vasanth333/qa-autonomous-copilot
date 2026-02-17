"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySeverityRules = applySeverityRules;
function applySeverityRules(cluster, aiSeverity) {
    const pattern = cluster.pattern.toLowerCase();
    // 🔹 Hard override rules
    if (pattern.includes("login")) {
        return "HIGH";
    }
    if (pattern.includes("payment")) {
        return "CRITICAL";
    }
    if (pattern.includes("timeout")) {
        return "HIGH";
    }
    return aiSeverity;
}
