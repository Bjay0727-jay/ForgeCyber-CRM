import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, action, children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-forge-border overflow-hidden ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-forge-border">
          <h3 className="font-heading text-base font-bold text-forge-navy">
            {title}
          </h3>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
