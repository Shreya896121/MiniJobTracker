import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`px-4 py-2.5 rounded-lg bg-slate-900 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all appearance-none cursor-pointer ${
            error
              ? "border-rose-500/50 focus:ring-rose-500/50"
              : "border-slate-800 focus:ring-teal-500/50"
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
