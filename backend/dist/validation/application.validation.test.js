"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const application_validation_1 = require("./application.validation");
(0, globals_1.describe)("Application Validation Schema", () => {
    (0, globals_1.describe)("createApplicationSchema", () => {
        (0, globals_1.it)("should succeed with valid data", () => {
            const validData = {
                companyName: "Google",
                jobTitle: "Software Engineer",
                jobType: "FULL_TIME",
                status: "APPLIED",
                appliedDate: "2026-06-19T00:00:00.000Z",
                notes: "First application",
            };
            const result = application_validation_1.createApplicationSchema.safeParse(validData);
            (0, globals_1.expect)(result.success).toBe(true);
        });
        (0, globals_1.it)("should fail when companyName is empty", () => {
            const invalidData = {
                companyName: "",
                jobTitle: "Software Engineer",
                jobType: "FULL_TIME",
                status: "APPLIED",
                appliedDate: "2026-06-19T00:00:00.000Z",
            };
            const result = application_validation_1.createApplicationSchema.safeParse(invalidData);
            (0, globals_1.expect)(result.success).toBe(false);
            if (!result.success) {
                (0, globals_1.expect)(result.error.issues[0].message).toBe("companyName cannot be empty");
            }
        });
        (0, globals_1.it)("should fail when jobType is invalid", () => {
            const invalidData = {
                companyName: "Meta",
                jobTitle: "Software Engineer",
                jobType: "CONTRACTOR",
                status: "APPLIED",
                appliedDate: "2026-06-19T00:00:00.000Z",
            };
            const result = application_validation_1.createApplicationSchema.safeParse(invalidData);
            (0, globals_1.expect)(result.success).toBe(false);
        });
    });
    (0, globals_1.describe)("updateApplicationSchema", () => {
        (0, globals_1.it)("should succeed with partial valid data", () => {
            const partialData = {
                companyName: "Netflix",
            };
            const result = application_validation_1.updateApplicationSchema.safeParse(partialData);
            (0, globals_1.expect)(result.success).toBe(true);
        });
    });
});
