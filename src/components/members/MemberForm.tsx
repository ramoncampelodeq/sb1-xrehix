import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Member, MemberFormData } from '../../types/member';

interface MemberFormProps {
  initialData?: Member;
  onSubmit: (data: MemberFormData) => void;
  onCancel: () => void;
}

function MemberForm({ initialData, onSubmit, onCancel }: MemberFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = React.useState<MemberFormData>(() => ({
    name: initialData?.name ?? '',
    cpf: initialData?.cpf ?? '',
    profession: initialData?.profession ?? '',
    degree: initialData?.degree ?? 'apprentice',
    birthday: initialData?.birthday ?? '',
    email: initialData?.email ?? '',
    phone: initialData?.phone ?? '',
    password: initialData?.password ?? '',
    highDegrees: initialData?.highDegrees ?? [],
    relatives: initialData?.relatives ?? [],
    joinDate: initialData?.joinDate ?? new Date().toISOString().split('T')[0]
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome Completo
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="input-primary"
          />
        </div>

        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
            CPF
          </label>
          <input
            type="text"
            id="cpf"
            required
            maxLength={14}
            value={formData.cpf}
            onChange={e => setFormData(prev => ({ 
              ...prev, 
              cpf: formatCPF(e.target.value)
            }))}
            className="input-primary"
            placeholder="000.000.000-00"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Senha de Acesso
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              required={!initialData}
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="input-primary pr-10"
              placeholder={initialData ? '••••••••' : 'Digite a senha'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
            Profissão
          </label>
          <input
            type="text"
            id="profession"
            required
            value={formData.profession}
            onChange={e => setFormData(prev => ({ ...prev, profession: e.target.value }))}
            className="input-primary"
          />
        </div>

        <div>
          <label htmlFor="degree" className="block text-sm font-medium text-gray-700">
            Grau
          </label>
          <select
            id="degree"
            required
            value={formData.degree}
            onChange={e => setFormData(prev => ({ 
              ...prev, 
              degree: e.target.value as Member['degree']
            }))}
            className="input-primary"
          >
            <option value="apprentice">Aprendiz</option>
            <option value="fellowcraft">Companheiro</option>
            <option value="master">Mestre</option>
          </select>
        </div>

        <div>
          <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
            Data de Nascimento
          </label>
          <input
            type="date"
            id="birthday"
            required
            value={formData.birthday}
            onChange={e => setFormData(prev => ({ ...prev, birthday: e.target.value }))}
            className="input-primary"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="input-primary"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Telefone
          </label>
          <input
            type="tel"
            id="phone"
            required
            value={formData.phone}
            onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="input-primary"
          />
        </div>

        <div>
          <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700">
            Data de Iniciação
          </label>
          <input
            type="date"
            id="joinDate"
            required
            value={formData.joinDate}
            onChange={e => setFormData(prev => ({ ...prev, joinDate: e.target.value }))}
            className="input-primary"
          />
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

export default MemberForm;