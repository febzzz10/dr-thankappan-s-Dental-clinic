'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { PiArrowRight } from 'react-icons/pi';

const buttonVariants = cva(
  'group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-semibold transition-[transform,opacity,background-color,box-shadow] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-teal-600 text-white shadow-ambient hover:shadow-[0_8px_32px_-8px_rgba(15,118,110,0.3)] hover:bg-teal-700',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
        outline:
          'border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300',
        ghost: 'text-slate-600 hover:bg-slate-100',
        danger: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-9 px-4 text-xs',
        md: 'h-10 px-5 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export function Button({
  className,
  variant,
  size,
  children,
  showArrow = true,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { showArrow?: boolean }) {
  const hasArrowIcon = showArrow && (variant === 'primary' || variant === 'danger');

  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      <span className="transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-[-2px]">
        {children}
      </span>
      {hasArrowIcon && (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:scale-105" aria-hidden="true">
          <PiArrowRight size={13} />
        </span>
      )}
    </button>
  );
}
