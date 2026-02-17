import fs from "fs";
import path from "path";
import { QAExecutiveReport } from "../types/triageTypes.js";

const REPORTS_DIR = path.resolve("reports");

export function saveReport(report: QAExecutiveReport): string {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = path.join(REPORTS_DIR, `report-${timestamp}.json`);

  fs.writeFileSync(filePath, JSON.stringify(report, null, 2));

  return filePath;
}

export function loadLatestReport(): QAExecutiveReport | null {
  if (!fs.existsSync(REPORTS_DIR)) return null;

  const files = fs
    .readdirSync(REPORTS_DIR)
    .filter((file) => file.endsWith(".json"))
    .sort();

  if (files.length === 0) return null;

  const latestFile = files[files.length - 1];
  const content = fs.readFileSync(
    path.join(REPORTS_DIR, latestFile),
    "utf-8"
  );

  return JSON.parse(content);
}
