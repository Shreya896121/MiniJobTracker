import React from "react";

interface NavbarProps {
  onNavigate: (page: "dashboard" | "create", editId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => onNavigate("dashboard")}
              className="flex items-center gap-2 bg-transparent border-0 cursor-pointer focus:outline-none"
            >
              <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                JobTracker
              </span>
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => onNavigate("dashboard")}
              className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors bg-transparent border-0 cursor-pointer focus:outline-none"
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate("create")}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:from-teal-600 hover:to-emerald-600 transition-all shadow-lg shadow-teal-500/20 border-0 cursor-pointer focus:outline-none"
            >
              + Add Application
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
