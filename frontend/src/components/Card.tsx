import React from "react";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = "", ...props }) => {
  return (
    <div
      className={`bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden shadow-xl shadow-slate-950/20 ${className}`}
      {...props}
    >
      {title && (
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/30">
          <h3 className="text-base font-bold text-slate-100">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
