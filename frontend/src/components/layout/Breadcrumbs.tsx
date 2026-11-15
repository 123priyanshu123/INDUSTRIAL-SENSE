import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  items: Array<{ label: string; href?: string }>;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1.5 text-[11px] font-mono text-[#a1a1aa] mb-1">
      <Link to="/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
        <Home className="w-3 h-3" />
        <span>SCADA</span>
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-[#5d3f3c]" />
          {item.href ? (
            <Link to={item.href} className="hover:text-white transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-bold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
