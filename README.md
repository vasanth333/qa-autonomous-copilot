# 🤖 QA Autonomous Copilot

AI-powered, risk-aware, multi-agent QA orchestration engine designed to analyze failed test logs, detect failure patterns, assess risk levels, and generate governed escalation decisions.

This project demonstrates production-grade backend architecture combined with AI-driven reasoning and deterministic governance logic.

---

## 🚀 Overview

QA Autonomous Copilot is a backend service that:

- Accepts failed test logs via API
- Clusters similar failures
- Performs AI-based root cause analysis
- Applies deterministic severity rules
- Calculates overall system risk
- Compares results with historical runs
- Generates executive QA reports
- Supports governed escalation workflows

Built using:

- Node.js
- TypeScript
- Express
- Zod (schema validation)
- Modular multi-agent orchestration architecture

---

## 🏗 System Architecture

```text
                ┌─────────────────────────────┐
                │     CI/CD / QA Tool         │
                └──────────────┬──────────────┘
                               ↓
                ┌─────────────────────────────┐
                │        Express API          │
                │   (Validation + Routing)    │
                └──────────────┬──────────────┘
                               ↓
                ┌─────────────────────────────┐
                │     Orchestrator Layer      │
                └──────────────┬──────────────┘
                               ↓
        ┌──────────────────────────────────────────────┐
        │              Multi-Agent Layer               │
        │----------------------------------------------│
        │  • Log Collector                             │
        │  • Clustering Agent                          │
        │  • Root Cause Agent                          │
        │  • Severity Agent                            │
        │  • Executive Summary Agent                   │
        └──────────────────────────────────────────────┘
                               ↓
                ┌─────────────────────────────┐
                │  Deterministic Rule Engine  │
                └──────────────┬──────────────┘
                               ↓
                ┌─────────────────────────────┐
                │     Trend Analyzer          │
                └──────────────┬──────────────┘
                               ↓
                ┌─────────────────────────────┐
                │        Risk Engine          │
                └──────────────┬──────────────┘
                               ↓
                ┌─────────────────────────────┐
                │   Governance / Escalation   │
                └─────────────────────────────┘
```

---

## 📡 API Endpoints

### Health Check

```
GET /health
```

Response:

```json
{
  "status": "OK"
}
```

---

### Analyze Failed Logs

```
POST /api/analyze
```

Request Body:

```json
{
  "logs": [
    "Login failed due to timeout",
    "Payment failed due to invalid currency"
  ]
}
```

Response:

```json
{
  "success": true,
  "data": {
    "executiveReport": { ... },
    "trendInsight": "...",
    "riskScore": 72
  }
}
```

---

## 🧠 Engineering Highlights

- Designed multi-agent orchestration pipeline
- Combined AI reasoning with deterministic rule enforcement
- Implemented risk-aware decision engine
- Built production-ready Express backend
- Centralized validation middleware (Zod)
- Global error handling middleware
- Modular, extensible architecture

---

## 🧪 Run Locally

Install dependencies:

```bash
npm install
```

Build:

```bash
npm run build
```

Start server:

```bash
npm run start
```

Server runs at:

```
http://localhost:3000
```

---

## 📜 License

MIT
