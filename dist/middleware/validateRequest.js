"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
function validateRequest(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                error: "Validation failed",
                details: error.errors,
            });
        }
    };
}
