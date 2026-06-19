import { z } from "zod";

export const createApplicationSchema = z.object({
  companyName: z.string({
    error: (issue) => issue.input === undefined ? "companyName is required" : "companyName must be a valid string",
  }).min(1, "companyName cannot be empty"),
  jobTitle: z.string({
    error: (issue) => issue.input === undefined ? "jobTitle is required" : "jobTitle must be a valid string",
  }).min(1, "jobTitle cannot be empty"),
  jobType: z.enum(["INTERNSHIP", "FULL_TIME", "PART_TIME"], {
    error: (issue) => issue.input === undefined ? "jobType is required" : "jobType must be INTERNSHIP, FULL_TIME, or PART_TIME",
  }),
  status: z.enum(["APPLIED", "INTERVIEWING", "OFFER", "REJECTED"]).default("APPLIED"),
  appliedDate: z.coerce.date({
    error: (issue) => issue.input === undefined ? "appliedDate is required" : "appliedDate must be a valid date",
  }),
  notes: z.string().optional(),
});

export const updateApplicationSchema = createApplicationSchema.partial();
