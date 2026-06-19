import { describe, it, expect } from "@jest/globals";
import { createApplicationSchema, updateApplicationSchema } from "./application.validation";

describe("Application Validation Schema", () => {
  describe("createApplicationSchema", () => {
    it("should succeed with valid data", () => {
      const validData = {
        companyName: "Google",
        jobTitle: "Software Engineer",
        jobType: "FULL_TIME",
        status: "APPLIED",
        appliedDate: "2026-06-19T00:00:00.000Z",
        notes: "First application",
      };

      const result = createApplicationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail when companyName is empty", () => {
      const invalidData = {
        companyName: "",
        jobTitle: "Software Engineer",
        jobType: "FULL_TIME",
        status: "APPLIED",
        appliedDate: "2026-06-19T00:00:00.000Z",
      };

      const result = createApplicationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("companyName cannot be empty");
      }
    });

    it("should fail when jobType is invalid", () => {
      const invalidData = {
        companyName: "Meta",
        jobTitle: "Software Engineer",
        jobType: "CONTRACTOR", // Invalid enum value
        status: "APPLIED",
        appliedDate: "2026-06-19T00:00:00.000Z",
      };

      const result = createApplicationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("updateApplicationSchema", () => {
    it("should succeed with partial valid data", () => {
      const partialData = {
        companyName: "Netflix",
      };

      const result = updateApplicationSchema.safeParse(partialData);
      expect(result.success).toBe(true);
    });
  });
});
