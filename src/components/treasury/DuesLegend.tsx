import React from 'react';
import DuesStatusBadge from './DuesStatusBadge';

export default function DuesLegend() {
  return (
    <div className="flex items-center space-x-4 text-sm text-gray-500">
      <div className="flex items-center">
        <DuesStatusBadge status="paid" />
        <span className="ml-2">Pago</span>
      </div>
      <div className="flex items-center">
        <DuesStatusBadge status="pending" />
        <span className="ml-2">Pendente</span>
      </div>
      <div className="flex items-center">
        <DuesStatusBadge status="late" />
        <span className="ml-2">Atrasado</span>
      </div>
    </div>
  );
}