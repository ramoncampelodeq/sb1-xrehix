import React, { useState } from 'react';
import { useMemberStore } from '../../stores/memberStore';
import { useTreasuryStore, MONTHLY_DUES_AMOUNT } from '../../stores/treasuryStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DuesStatusBadge from './DuesStatusBadge';
import DuesLegend from './DuesLegend';

export default function DuesManagement() {
  const members = useMemberStore(state => state.members);
  const { getDuesStatus, recordDuesPayment } = useTreasuryStore();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = Array.from({ length: 12 }, (_, i) => i);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handlePayment = (memberId: number, month: number) => {
    if (window.confirm('Confirmar pagamento da mensalidade?')) {
      recordDuesPayment(memberId, month, selectedYear);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center sm:justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Controle de Mensalidades
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Valor atual: {formatCurrency(MONTHLY_DUES_AMOUNT)}
              </p>
            </div>
            <div className="mt-3 sm:mt-0 sm:flex sm:items-center space-x-4">
              <DuesLegend />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="block w-32 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2 border"
              >
                {[selectedYear - 1, selectedYear, selectedYear + 1].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">
                    Membro
                  </th>
                  {months.map(month => (
                    <th
                      key={month}
                      scope="col"
                      className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {format(new Date(2024, month), 'MMM', { locale: ptBR })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white">
                      {member.name}
                    </td>
                    {months.map(month => {
                      const status = getDuesStatus(member.id, month, selectedYear);
                      const isDisabled = 
                        month > currentMonth && 
                        selectedYear >= currentYear;

                      return (
                        <td
                          key={month}
                          className="px-3 py-4 whitespace-nowrap text-sm text-center"
                        >
                          <DuesStatusBadge
                            status={status.status}
                            onClick={
                              status.status !== 'paid'
                                ? () => handlePayment(member.id, month)
                                : undefined
                            }
                            disabled={isDisabled}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}