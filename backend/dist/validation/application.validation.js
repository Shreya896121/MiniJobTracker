"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationSchema = exports.createApplicationSchema = void 0;
const zod_1 = require("zod");
exports.createApplicationSchema = zod_1.z.object({
    companyName: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "companyName is required" : "companyName must be a valid string",
    }).min(1, "companyName cannot be empty"),
    jobTitle: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "jobTitle is required" : "jobTitle must be a valid string",
    }).min(1, "jobTitle cannot be empty"),
    jobType: zod_1.z.enum(["INTERNSHIP", "FULL_TIME", "PART_TIME"], {
        error: (issue) => issue.input === undefined ? "jobType is required" : "jobType must be INTERNSHIP, FULL_TIME, or PART_TIME",
    }),
    status: zod_1.z.enum(["APPLIED", "INTERVIEWING", "OFFER", "REJECTED"]).default("APPLIED"),
    appliedDate: zod_1.z.coerce.date({
        error: (issue) => issue.input === undefined ? "appliedDate is required" : "appliedDate must be a valid date",
    }),
    notes: zod_1.z.string().optional(),
});
exports.updateApplicationSchema = exports.createApplicationSchema.partial();
