"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveReport = saveReport;
exports.loadLatestReport = loadLatestReport;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const REPORTS_DIR = path_1.default.resolve("reports");
function saveReport(report) {
    if (!fs_1.default.existsSync(REPORTS_DIR)) {
        fs_1.default.mkdirSync(REPORTS_DIR);
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filePath = path_1.default.join(REPORTS_DIR, `report-${timestamp}.json`);
    fs_1.default.writeFileSync(filePath, JSON.stringify(report, null, 2));
    return filePath;
}
function loadLatestReport() {
    if (!fs_1.default.existsSync(REPORTS_DIR))
        return null;
    const files = fs_1.default
        .readdirSync(REPORTS_DIR)
        .filter((file) => file.endsWith(".json"))
        .sort();
    if (files.length === 0)
        return null;
    const latestFile = files[files.length - 1];
    const content = fs_1.default.readFileSync(path_1.default.join(REPORTS_DIR, latestFile), "utf-8");
    return JSON.parse(content);
}
