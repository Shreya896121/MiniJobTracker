import React, { useState, useEffect } from "react";
import type { Application } from "../types";
import { fetchApplications, deleteApplication } from "../services/api";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Button } from "../components/Button";

interface DashboardProps {
  onNavigate: (page: "dashboard" | "create" | "edit", editId?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch applications based on filters
  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const filterParams = {
        status: status === "ALL" ? undefined : status,
        search: search.trim() === "" ? undefined : search,
      };
      const data = await fetchApplications(filterParams);
      setApplications(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger refetch when filters change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadApplications();
    }, 300); // Debounce search changes

    return () => clearTimeout(delayDebounce);
  }, [search, status]);

  // Handle application deletion
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this application?")) {
      return;
    }
    try {
      await deleteApplication(id);
      // Remove from state or refresh
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(msg || "Failed to delete application.");
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "APPLIED":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "INTERVIEWING":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "OFFER":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "REJECTED":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    }
  };

  const formatJobType = (type: string) => {
    return type.replace("_", " ");
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-200 to-emerald-200 bg-clip-text text-transparent">
            Application Dashboard
          </h1>
          <p className="text-slate-400 mt-1">
            Keep track of your job search progress, interview stages, and offers.
          </p>
        </div>
        <div>
          <Button variant="primary" className="w-full md:w-auto" onClick={() => onNavigate("create")}>
            + New Application
          </Button>
        </div>
      </div>

      {/* Search & Filtering Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-end bg-slate-900/30 p-4 border border-slate-800/80 rounded-xl">
        <div className="flex-1 w-full">
          <Input
            label="Search"
            placeholder="Search by company or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            label="Status Filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: "ALL", label: "All Statuses" },
              { value: "APPLIED", label: "Applied" },
              { value: "INTERVIEWING", label: "Interviewing" },
              { value: "OFFER", label: "Offer" },
              { value: "REJECTED", label: "Rejected" },
            ]}
          />
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-slate-900/10 border border-slate-800/50 rounded-xl">
          <svg className="animate-spin h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-400 font-medium">Fetching applications...</p>
        </div>
      ) : error ? (
        <div className="p-6 text-center border border-rose-500/20 bg-rose-500/5 rounded-xl space-y-3">
          <p className="text-rose-400 font-medium">{error}</p>
          <Button variant="secondary" className="text-xs" onClick={loadApplications}>
            Try Again
          </Button>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 border border-slate-800/80 bg-slate-900/20 rounded-xl space-y-4">
          <p className="text-slate-400 font-medium">No job applications found.</p>
          <Button variant="primary" className="text-xs" onClick={() => onNavigate("create")}>
            Add Your First Application
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-800/80 bg-slate-900/40 rounded-xl">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-950/40">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Company Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Job Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Applied Date</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-transparent">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-200">{app.companyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{app.jobTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    <span className="bg-slate-800/50 px-2 py-1 rounded text-xs font-medium uppercase">
                      {formatJobType(app.jobType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider ${getStatusBadgeClass(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {new Date(app.appliedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button variant="secondary" className="px-3 py-1.5 text-xs" onClick={() => onNavigate("edit", app.id)}>
                      Edit
                    </Button>
                    <Button variant="danger" className="px-3 py-1.5 text-xs" onClick={() => handleDelete(app.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
