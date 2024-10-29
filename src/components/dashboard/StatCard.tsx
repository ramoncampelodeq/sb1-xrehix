import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({ title, value, icon: Icon, color, trend }: StatCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg transition-all hover:shadow-md">
      <div className="p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${color} rounded-xl p-4`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {trend && (
                  <div className={`ml-2 flex items-baseline text-sm ${
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <span className="sr-only">
                      {trend.isPositive ? 'Increased by' : 'Decreased by'}
                    </span>
                    {trend.value}%
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}