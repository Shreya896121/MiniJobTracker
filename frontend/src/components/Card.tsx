import React from "react";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = "", ...props }) => {
  return (
    <div
      className={`bg-white border border-slate-200/85 rounded-xl overflow-hidden shadow-xs ${className}`}
      {...props}
    >
      {title && (
        <div className="px-6 py-4 border-b border-slate-150 bg-slate-50/50">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
