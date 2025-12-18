import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-2 ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-slate-900/50 border border-slate-700 text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-slate-600 outline-none",
              icon && "pl-10",
              error && "border-rose-500 focus:ring-rose-500/50 focus:border-rose-500",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-rose-400 ml-1">{error}</p>}
      </div>
    );
  }
);
