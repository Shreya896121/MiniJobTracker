import React, { useState, useEffect } from "react";
import { fetchApplicationById } from "../services/api";
import type { Application } from "../types";
import { Button } from "../components/Button";

interface ApplicationDetailProps {
  id: string;
  onNavigate: (page: "dashboard" | "create" | "edit" | "detail", editId?: string) => void;
}

export const ApplicationDetail: React.FC<ApplicationDetailProps> = ({ id, onNavigate }) => {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadApplication = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchApplicationById(id);
        setApplication(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg || "Failed to load application details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadApplication();
    }
  }, [id]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "APPLIED":
        return "bg-amber-50 text-amber-700 border border-amber-150";
      case "INTERVIEWING":
        return "bg-blue-50 text-blue-700 border border-blue-150";
      case "OFFER":
        return "bg-emerald-50 text-emerald-700 border border-emerald-150";
      case "REJECTED":
        return "bg-rose-50 text-rose-700 border border-rose-150";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  const formatJobType = (type: string) => {
    return type.replace("_", " ");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-slate-500 font-medium">Loading details...</p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="p-6 text-center border border-rose-200 bg-rose-50 rounded-xl space-y-4 max-w-xl mx-auto shadow-xs">
        <p className="text-rose-600 font-medium">{error || "Application not found"}</p>
        <Button variant="secondary" onClick={() => onNavigate("dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={() => onNavigate("dashboard")}>
          &larr; Back
        </Button>
        <Button variant="primary" onClick={() => onNavigate("edit", application.id)}>
          Edit Application
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
        <div>
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold tracking-wider ${getStatusBadgeClass(application.status)}`}>
            {application.status}
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
            {application.companyName}
          </h1>
          <p className="text-xl text-blue-600 mt-1 font-semibold">
            {application.jobTitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-y border-slate-150">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Job Type</span>
            <p className="text-slate-700 mt-1 font-semibold uppercase">
              {formatJobType(application.jobType)}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Applied Date</span>
            <p className="text-slate-700 mt-1 font-semibold">
              {new Date(application.appliedDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Created At</span>
            <p className="text-slate-500 mt-1 text-sm font-medium">
              {new Date(application.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Last Updated</span>
            <p className="text-slate-500 mt-1 text-sm font-medium">
              {new Date(application.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div>
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Notes</span>
          <p className="text-slate-700 mt-2 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 border border-slate-200 rounded-xl">
            {application.notes || <span className="text-slate-400 italic font-normal">No notes added.</span>}
          </p>
        </div>
      </div>
    </div>
  );
};
