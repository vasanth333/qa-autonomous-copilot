"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectLogs = collectLogs;
function collectLogs(rawLogs) {
    return rawLogs.map((log, index) => {
        return {
            testName: `Test-${index + 1}`,
            errorMessage: log,
            environment: "staging",
            timestamp: new Date().toISOString(),
        };
    });
}
