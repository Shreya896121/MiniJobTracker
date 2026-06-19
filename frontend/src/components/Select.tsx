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
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`px-4 py-2.5 rounded-lg bg-white border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all appearance-none cursor-pointer ${
            error
              ? "border-rose-500/55 focus:ring-rose-500/50"
              : "border-slate-250 focus:ring-blue-500/50"
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white">
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
