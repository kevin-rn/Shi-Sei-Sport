import type { ReactNode } from 'react';

interface PageHeaderProps {
  icon?: ReactNode;
  title: string;
  subtitle?: ReactNode;
}

export const PageHeader = ({ icon, title, subtitle }: PageHeaderProps) => (
  <div className="text-center mb-8 md:mb-16">
    <h1 className="text-xl md:text-2xl font-extrabold text-judo-dark mb-4 flex items-center justify-center gap-4">
      {icon}
      {title}
    </h1>
    <div className="w-24 h-1 bg-judo-red mx-auto rounded-full"></div>
    {subtitle && <div className="mt-6">{subtitle}</div>}
  </div>
);
