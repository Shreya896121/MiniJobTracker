import React, { useState, useEffect } from "react";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Button } from "../components/Button";
import { fetchApplicationById, updateApplication } from "../services/api";
import type { JobType, ApplicationStatus, UpdateApplicationInput } from "../types";

interface EditApplicationProps {
  id: string;
  onNavigate: (page: "dashboard" | "create" | "edit") => void;
}

export const EditApplication: React.FC<EditApplicationProps> = ({ id, onNavigate }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    jobType: "FULL_TIME" as JobType,
    status: "APPLIED" as ApplicationStatus,
    appliedDate: "",
    notes: "",
  });

  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch application details on component mount
  useEffect(() => {
    const loadApplication = async () => {
      try {
        setIsLoadingApp(true);
        setFetchError(null);
        const app = await fetchApplicationById(id);

        setFormData({
          companyName: app.companyName,
          jobTitle: app.jobTitle,
          jobType: app.jobType,
          status: app.status,
          // Extract only YYYY-MM-DD from ISO appliedDate for the date input
          appliedDate: app.appliedDate.split("T")[0],
          notes: app.notes || "",
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setFetchError(msg || "Failed to load application details.");
      } finally {
        setIsLoadingApp(false);
      }
    };

    loadApplication();
  }, [id]);

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

      const inputData: UpdateApplicationInput = {
        ...formData,
        appliedDate: new Date(formData.appliedDate).toISOString(),
      };

      await updateApplication(id, inputData);

      setSuccessMessage("Application updated successfully!");

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        onNavigate("dashboard");
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setApiError(msg || "Failed to update application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingApp) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-slate-500 font-medium">Loading application details...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center border border-rose-200 bg-rose-50 rounded-xl space-y-4 shadow-xs">
        <p className="text-rose-600 font-medium">{fetchError}</p>
        <Button variant="secondary" onClick={() => onNavigate("dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Edit Application
          </h1>
          <p className="text-slate-500 mt-1">Modify application details.</p>
        </div>
        <Button variant="secondary" onClick={() => onNavigate("dashboard")}>
          Back
        </Button>
      </div>

      {apiError && (
        <div className="p-4 border border-rose-200 bg-rose-50 text-rose-700 rounded-lg text-sm shadow-xs font-semibold">
          {apiError}
        </div>
      )}

      {successMessage && (
        <div className="p-4 border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-lg text-sm shadow-xs font-semibold">
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
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              rows={4}
              placeholder="Any comments, contact info, or steps..."
              className="px-4 py-2.5 rounded-lg bg-white border border-slate-250 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all resize-none font-sans"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-150">
            <Button variant="secondary" type="button" onClick={() => onNavigate("dashboard")}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Update Application
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
