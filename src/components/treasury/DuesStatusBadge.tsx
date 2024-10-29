import React from 'react';
import { Check, AlertCircle, X } from 'lucide-react';

interface DuesStatusBadgeProps {
  status: 'paid' | 'pending' | 'late';
  onClick?: () => void;
  disabled?: boolean;
}

export default function DuesStatusBadge({ status, onClick, disabled }: DuesStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'paid':
        return {
          icon: <Check className="w-4 h-4" />,
          colors: 'bg-green-100 text-green-800'
        };
      case 'pending':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          colors: 'bg-yellow-100 text-yellow-800'
        };
      case 'late':
        return {
          icon: <X className="w-4 h-4" />,
          colors: 'bg-red-100 text-red-800'
        };
    }
  };

  const config = getStatusConfig();
  const Element = onClick && !disabled ? 'button' : 'span';

  return (
    <Element
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${config.colors}
        ${onClick && !disabled ? 'cursor-pointer hover:opacity-80' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        transition-opacity duration-200
      `}
    >
      {config.icon}
    </Element>
  );
}