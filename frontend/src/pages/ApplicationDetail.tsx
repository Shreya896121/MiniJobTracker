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
      <div className="flex flex-col items-center justify-center py-24 space-y-6">
        <svg className="animate-spin h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-slate-500 font-semibold text-lg">Loading details...</p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="p-8 text-center border border-rose-200 bg-rose-50 rounded-2xl space-y-6 max-w-xl mx-auto shadow-sm">
        <p className="text-rose-600 font-semibold text-lg">{error || "Application not found"}</p>
        <Button variant="secondary" onClick={() => onNavigate("dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={() => onNavigate("dashboard")} className="px-6 py-2.5 text-base">
          &larr; Back
        </Button>
        <Button variant="primary" onClick={() => onNavigate("edit", application.id)} className="px-6 py-2.5 text-base font-semibold">
          Edit Application
        </Button>
      </div>

      {/* Details Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 space-y-10 shadow-xs">
        {/* Company Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            {application.companyName}
          </h1>
        </div>

        {/* Info Fields Area */}
        <div className="space-y-8 py-8 border-y border-slate-150">
          {/* Row 1: Job Title and Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Job Title</span>
              <p className="text-2xl text-blue-600 mt-2 font-semibold">
                {application.jobTitle}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Status</span>
              <div className="mt-2.5">
                <span className={`inline-flex px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase ${getStatusBadgeClass(application.status)}`}>
                  {application.status}
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: Remaining Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
            <div>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Job Type</span>
              <p className="text-xl text-slate-700 mt-2 font-bold uppercase">
                {formatJobType(application.jobType)}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Applied Date</span>
              <p className="text-xl text-slate-700 mt-2 font-semibold">
                {new Date(application.appliedDate).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="space-y-3">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Notes</span>
          <p className="text-slate-700 text-base mt-2 whitespace-pre-wrap leading-relaxed bg-slate-50 p-6 border border-slate-200 rounded-2xl">
            {application.notes || <span className="text-slate-450 italic font-normal">No notes added.</span>}
          </p>
        </div>
      </div>
    </div>
  );
};
