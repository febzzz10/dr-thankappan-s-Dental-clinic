import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 [&>svg]:h-4 [&>svg]:w-4">
          {icon}
        </div>
      )}
      <input
        ref={ref}
        className={cn(
          'block w-full rounded-xl border border-slate-200 py-2.5 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20',
          icon ? 'pl-10' : 'pl-4',
          className,
        )}
        {...props}
      />
    </div>
  ),
);
Input.displayName = 'Input';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon?: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, icon, children, ...props }, ref) => (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 [&>svg]:h-4 [&>svg]:w-4">
          {icon}
        </div>
      )}
      <select
        ref={ref}
        className={cn(
          'block w-full rounded-xl border border-slate-200 py-2.5 pr-4 text-sm text-slate-900 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20',
          icon ? 'pl-10' : 'pl-4',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  ),
);
Select.displayName = 'Select';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon?: React.ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, icon, ...props }, ref) => (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-3 text-slate-400 [&>svg]:h-4 [&>svg]:w-4">
          {icon}
        </div>
      )}
      <textarea
        ref={ref}
        className={cn(
          'block w-full rounded-xl border border-slate-200 py-2.5 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20',
          icon ? 'pl-10' : 'pl-4',
          className,
        )}
        {...props}
      />
    </div>
  ),
);
Textarea.displayName = 'Textarea';
