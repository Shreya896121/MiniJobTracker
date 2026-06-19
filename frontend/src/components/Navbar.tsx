import React from "react";

interface NavbarProps {
  onNavigate: (page: "dashboard" | "create", editId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate("dashboard")}
              className="flex items-center gap-2 bg-transparent border-0 cursor-pointer focus:outline-none"
            >
              <div className="bg-blue-600 p-1.5 rounded-lg text-white flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 17V9m4 8v-5m4 5v-8m4 8v-11" />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                JobTrack Pro
              </span>
            </button>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => onNavigate("dashboard")}
                className="text-slate-500 hover:text-slate-900 px-1 py-2 text-sm font-semibold transition-colors bg-transparent border-0 cursor-pointer focus:outline-none border-b-2 border-transparent hover:border-slate-350"
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate("dashboard")}
                className="text-slate-900 px-1 py-2 text-sm font-semibold transition-colors bg-transparent border-0 cursor-pointer focus:outline-none border-b-2 border-blue-600"
              >
                Applications
              </button>
              <button
                className="text-slate-500 hover:text-slate-900 px-1 py-2 text-sm font-semibold transition-colors bg-transparent border-0 cursor-pointer focus:outline-none border-b-2 border-transparent"
              >
                Contacts
              </button>
              <button
                className="text-slate-500 hover:text-slate-900 px-1 py-2 text-sm font-semibold transition-colors bg-transparent border-0 cursor-pointer focus:outline-none border-b-2 border-transparent"
              >
                Settings
              </button>
            </div>
          </div>

          {/* User Profile and Notification */}
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer hover:bg-slate-50 p-1.5 rounded-full transition-colors">
              <svg className="w-6 h-6 text-slate-400 hover:text-slate-650" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </div>
            <div className="flex items-center gap-2">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                alt="Sarah Jenkins"
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <span className="hidden sm:inline text-sm font-semibold text-slate-700">
                Sarah Jenkins
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
