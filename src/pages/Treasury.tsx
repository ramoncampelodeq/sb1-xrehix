import React, { useState } from 'react';
import { Plus, Search, FileText, Edit2, Trash2, CreditCard } from 'lucide-react';
import { useTreasuryStore } from '../stores/treasuryStore';
import { useMemberStore } from '../stores/memberStore';
import TransactionForm from '../components/treasury/TransactionForm';
import DuesPaymentForm from '../components/treasury/DuesPaymentForm';
import DuesManagement from '../components/treasury/DuesManagement';
import { Transaction } from '../types/transaction';
import { format } from 'date-fns';

export default function Treasury() {
  const [showForm, setShowForm] = useState(false);
  const [showDuesForm, setShowDuesForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [activeTab, setActiveTab] = useState<'transactions' | 'dues'>('transactions');
  
  const { 
    transactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
    getBalance,
    getMonthlyBalance,
    recordDuesPayment
  } = useTreasuryStore();
  
  const members = useMemberStore(state => state.members);

  const currentBalance = getBalance();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyBalance = getMonthlyBalance(currentMonth, currentYear);

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.memberId && 
          members
            .find(m => m.id === transaction.memberId)
            ?.name.toLowerCase()
            .includes(searchTerm.toLowerCase()));
      
      const matchesType = 
        filterType === 'all' || transaction.type === filterType;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSubmit = (data: any) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
    } else {
      addTransaction(data);
    }
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleDuesSubmit = (data: { memberId: number; month: number; year: number }) => {
    recordDuesPayment(data.memberId, data.month, data.year);
    setShowDuesForm(false);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteTransaction(id);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tesouraria</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie as finanças da Loja
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowDuesForm(true)}
            className="btn-primary flex items-center"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Mensalidade
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Transação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <h3 className="text-sm font-medium text-gray-500">Saldo Atual</h3>
            <div className={`mt-1 text-2xl font-semibold ${
              currentBalance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(currentBalance)}
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <h3 className="text-sm font-medium text-gray-500">Receitas do Mês</h3>
            <div className="mt-1 text-2xl font-semibold text-green-600">
              {formatCurrency(Math.max(0, monthlyBalance))}
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <h3 className="text-sm font-medium text-gray-500">Despesas do Mês</h3>
            <div className="mt-1 text-2xl font-semibold text-red-600">
              {formatCurrency(Math.abs(Math.min(0, monthlyBalance)))}
            </div>
          </div>
        </div>
      </div>

      {showForm ? (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium mb-4">
              {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
            </h2>
            <TransactionForm
              initialData={editingTransaction ?? undefined}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingTransaction(null);
              }}
            />
          </div>
        </div>
      ) : showDuesForm ? (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <DuesPaymentForm
              onSubmit={handleDuesSubmit}
              onCancel={() => setShowDuesForm(false)}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <nav className="flex space-x-4" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'transactions'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Transações
              </button>
              <button
                onClick={() => setActiveTab('dues')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'dues'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Mensalidades
              </button>
            </nav>
          </div>

          {activeTab === 'transactions' ? (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center sm:justify-between mb-4">
                  <div className="relative rounded-md shadow-sm max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar transações..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2 border"
                    />
                  </div>
                  
                  <div className="mt-3 sm:mt-0">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                      className="block w-full sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2 border"
                    >
                      <option value="all">Todas as Transações</option>
                      <option value="income">Apenas Receitas</option>
                      <option value="expense">Apenas Despesas</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Descrição
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Categoria
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Valor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTransactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {format(new Date(transaction.date), 'dd/MM/yyyy')}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{transaction.description}</div>
                              {transaction.memberId && (
                                <div className="text-sm text-gray-500">
                                  {members.find(m => m.id === transaction.memberId)?.name}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                {transaction.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm font-medium ${
                                transaction.type === 'income' 
                                  ? 'text-green-600' 
                                  : 'text-red-600'
                              }`}>
                                {transaction.type === 'income' ? '+' : '-'}
                                {formatCurrency(transaction.amount)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                transaction.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : transaction.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {transaction.status === 'completed' && 'Concluído'}
                                {transaction.status === 'pending' && 'Pendente'}
                                {transaction.status === 'cancelled' && 'Cancelado'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {transaction.receipt && (
                                <a
                                  href={transaction.receipt}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-600 hover:text-gray-900 mr-3"
                                  title="Ver Comprovante"
                                >
                                  <FileText className="w-5 h-5" />
                                </a>
                              )}
                              <button
                                onClick={() => handleEdit(transaction)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                                title="Editar"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(transaction.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Excluir"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <DuesManagement />
          )}
        </>
      )}
    </div>
  );
}