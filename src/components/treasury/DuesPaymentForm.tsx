import React, { useState } from 'react';
import { useMemberStore } from '../../stores/memberStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MONTHLY_DUES_AMOUNT } from '../../stores/treasuryStore';

interface DuesPaymentFormProps {
  onSubmit: (data: { memberId: number; month: number; year: number }) => void;
  onCancel: () => void;
}

export default function DuesPaymentForm({ onSubmit, onCancel }: DuesPaymentFormProps) {
  const members = useMemberStore(state => state.members);
  const [formData, setFormData] = useState({
    memberId: '',
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  });

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(2024, i), 'MMMM', { locale: ptBR })
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.memberId) return;
    
    onSubmit({
      memberId: parseInt(formData.memberId),
      month: formData.month,
      year: formData.year
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Nova Mensalidade
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Valor: {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(MONTHLY_DUES_AMOUNT)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="memberId" className="block text-sm font-medium text-gray-700">
            Membro
          </label>
          <select
            id="memberId"
            required
            value={formData.memberId}
            onChange={e => setFormData(prev => ({ ...prev, memberId: e.target.value }))}
            className="input-primary"
          >
            <option value="">Selecione um membro</option>
            {members.map(member => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="month" className="block text-sm font-medium text-gray-700">
            Mês de Referência
          </label>
          <select
            id="month"
            required
            value={formData.month}
            onChange={e => setFormData(prev => ({ ...prev, month: parseInt(e.target.value) }))}
            className="input-primary"
          >
            {months.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">
            Ano
          </label>
          <select
            id="year"
            required
            value={formData.year}
            onChange={e => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
            className="input-primary"
          >
            {[formData.year - 1, formData.year, formData.year + 1].map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          Registrar Pagamento
        </button>
      </div>
    </form>
  );
}