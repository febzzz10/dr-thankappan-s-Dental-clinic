import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  as?: 'div' | 'article' | 'section';
}

export function Card({ className, children, as: Tag = 'div' }: CardProps) {
  return (
    <Tag
      className={cn(
        'doppelrand transition-[transform,opacity,box-shadow] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2',
        className,
      )}
    >
      <div className="doppelrand-inner p-6">
        {children}
      </div>
    </Tag>
  );
}
