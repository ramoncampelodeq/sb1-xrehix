import React from 'react';
import { Transaction, TransactionFormData, TransactionCategory } from '../../types/transaction';
import { useMemberStore } from '../../stores/memberStore';

interface TransactionFormProps {
  initialData?: Transaction;
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
}

export default function TransactionForm({ initialData, onSubmit, onCancel }: TransactionFormProps) {
  const members = useMemberStore(state => state.members);
  const [formData, setFormData] = React.useState<TransactionFormData>(() => ({
    date: initialData?.date ?? new Date().toISOString().split('T')[0],
    type: initialData?.type ?? 'income',
    category: initialData?.category ?? 'dues',
    description: initialData?.description ?? '',
    amount: initialData?.amount ?? 0,
    memberId: initialData?.memberId,
    receipt: initialData?.receipt ?? '',
    status: initialData?.status ?? 'completed'
  }));

  const categories: { value: TransactionCategory; label: string }[] = [
    { value: 'dues', label: 'Mensalidade' },
    { value: 'donation', label: 'Doação' },
    { value: 'event', label: 'Evento' },
    { value: 'maintenance', label: 'Manutenção' },
    { value: 'utility', label: 'Utilidades' },
    { value: 'charity', label: 'Caridade' },
    { value: 'other', label: 'Outros' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Data
          </label>
          <input
            type="date"
            id="date"
            required
            value={formData.date}
            onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="input-primary"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Tipo
          </label>
          <select
            id="type"
            required
            value={formData.type}
            onChange={e => setFormData(prev => ({ 
              ...prev, 
              type: e.target.value as Transaction['type']
            }))}
            className="input-primary"
          >
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Categoria
          </label>
          <select
            id="category"
            required
            value={formData.category}
            onChange={e => setFormData(prev => ({ 
              ...prev, 
              category: e.target.value as TransactionCategory 
            }))}
            className="input-primary"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Valor
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">R$</span>
            </div>
            <input
              type="number"
              id="amount"
              required
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={e => setFormData(prev => ({ 
                ...prev, 
                amount: parseFloat(e.target.value) 
              }))}
              className="input-primary pl-12"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            id="description"
            required
            rows={3}
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="input-primary"
          />
        </div>

        {formData.type === 'income' && (
          <div>
            <label htmlFor="memberId" className="block text-sm font-medium text-gray-700">
              Membro
            </label>
            <select
              id="memberId"
              value={formData.memberId ?? ''}
              onChange={e => setFormData(prev => ({ 
                ...prev, 
                memberId: e.target.value ? parseInt(e.target.value) : undefined 
              }))}
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
        )}

        <div>
          <label htmlFor="receipt" className="block text-sm font-medium text-gray-700">
            Comprovante (URL)
          </label>
          <input
            type="url"
            id="receipt"
            value={formData.receipt}
            onChange={e => setFormData(prev => ({ ...prev, receipt: e.target.value }))}
            className="input-primary"
            placeholder="https://"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            required
            value={formData.status}
            onChange={e => setFormData(prev => ({ 
              ...prev, 
              status: e.target.value as Transaction['status']
            }))}
            className="input-primary"
          >
            <option value="pending">Pendente</option>
            <option value="completed">Concluído</option>
            <option value="cancelled">Cancelado</option>
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
          {initialData ? 'Atualizar' : 'Cadastrar'}
        </button>
      </div>
    </form>
  );
}