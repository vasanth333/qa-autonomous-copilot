"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeSchema = void 0;
const zod_1 = require("zod");
exports.analyzeSchema = zod_1.z.object({
    logs: zod_1.z
        .array(zod_1.z.string().min(5))
        .min(1, "At least one log is required"),
});
