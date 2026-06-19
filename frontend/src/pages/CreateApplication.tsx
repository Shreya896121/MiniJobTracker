import React, { useState } from "react";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Button } from "../components/Button";
import { createApplication } from "../services/api";
import type { JobType, ApplicationStatus, CreateApplicationInput } from "../types";

interface CreateApplicationProps {
  onNavigate: (page: "dashboard" | "create" | "edit") => void;
}

export const CreateApplication: React.FC<CreateApplicationProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    jobType: "FULL_TIME" as JobType,
    status: "APPLIED" as ApplicationStatus,
    appliedDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for field when it is changed
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company Name is required";
    } else if (formData.companyName.trim().length < 2) {
      newErrors.companyName = "Company Name must be at least 2 characters";
    }

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job Title is required";
    }

    if (!formData.appliedDate) {
      newErrors.appliedDate = "Applied Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError(null);
      setSuccessMessage(null);

      const inputData: CreateApplicationInput = {
        ...formData,
        appliedDate: new Date(formData.appliedDate).toISOString(),
      };

      await createApplication(inputData);

      setSuccessMessage("Application created successfully!");
      setFormData({
        companyName: "",
        jobTitle: "",
        jobType: "FULL_TIME",
        status: "APPLIED",
        appliedDate: new Date().toISOString().split("T")[0],
        notes: "",
      });

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        onNavigate("dashboard");
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setApiError(msg || "Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-200 to-emerald-200 bg-clip-text text-transparent">
            Add Application
          </h1>
          <p className="text-slate-400 mt-1">Record a new job application details.</p>
        </div>
        <Button variant="secondary" onClick={() => onNavigate("dashboard")}>
          Back
        </Button>
      </div>

      {apiError && (
        <div className="p-4 border border-rose-500/20 bg-rose-500/5 text-rose-400 rounded-lg text-sm">
          {apiError}
        </div>
      )}

      {successMessage && (
        <div className="p-4 border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 rounded-lg text-sm">
          {successMessage}
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Company Name"
              name="companyName"
              placeholder="e.g. Google"
              error={errors.companyName}
              value={formData.companyName}
              onChange={handleChange}
            />
            <Input
              label="Job Title"
              name="jobTitle"
              placeholder="e.g. Software Engineer"
              error={errors.jobTitle}
              value={formData.jobTitle}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Job Type"
              name="jobType"
              error={errors.jobType}
              value={formData.jobType}
              onChange={handleChange}
              options={[
                { value: "FULL_TIME", label: "Full Time" },
                { value: "PART_TIME", label: "Part Time" },
                { value: "INTERNSHIP", label: "Internship" },
              ]}
            />
            <Select
              label="Status"
              name="status"
              error={errors.status}
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: "APPLIED", label: "Applied" },
                { value: "INTERVIEWING", label: "Interviewing" },
                { value: "OFFER", label: "Offer" },
                { value: "REJECTED", label: "Rejected" },
              ]}
            />
          </div>

          <Input
            label="Applied Date"
            name="appliedDate"
            type="date"
            error={errors.appliedDate}
            value={formData.appliedDate}
            onChange={handleChange}
          />

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              rows={4}
              placeholder="Any comments, contact info, or steps..."
              className="px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all resize-none font-sans"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/60">
            <Button variant="secondary" type="button" onClick={() => onNavigate("dashboard")}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Save Application
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
