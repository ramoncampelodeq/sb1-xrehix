import React, { useState } from 'react';
import { Save } from 'lucide-react';

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  degree: 'apprentice' | 'fellowcraft' | 'master';
  occupation: string;
  address: string;
  city: string;
  state: string;
  birthDate: string;
  initiationDate: string;
}

interface PersonalInfoFormProps {
  initialData: PersonalInfo;
}

export default function PersonalInfoForm({ initialData }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to update user info
    setIsEditing(false);
  };

  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
    'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
    'SP', 'SE', 'TO'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="btn-secondary"
        >
          {isEditing ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome Completo
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            disabled={!isEditing}
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
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            disabled={!isEditing}
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
            value={formData.phone}
            onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            disabled={!isEditing}
            className="input-primary"
          />
        </div>

        <div>
          <label htmlFor="degree" className="block text-sm font-medium text-gray-700">
            Grau
          </label>
          <select
            id="degree"
            value={formData.degree}
            onChange={e => setFormData(prev => ({ 
              ...prev, 
              degree: e.target.value as PersonalInfo['degree']
            }))}
            disabled={!isEditing}
            className="input-primary"
          >
            <option value="apprentice">Aprendiz</option>
            <option value="fellowcraft">Companheiro</option>
            <option value="master">Mestre</option>
          </select>
        </div>

        <div>
          <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
            Profissão
          </label>
          <input
            type="text"
            id="occupation"
            value={formData.occupation}
            onChange={e => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
            disabled={!isEditing}
            className="input-primary"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Endereço
          </label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
            disabled={!isEditing}
            className="input-primary"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Cidade
          </label>
          <input
            type="text"
            id="city"
            value={formData.city}
            onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
            disabled={!isEditing}
            className="input-primary"
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            id="state"
            value={formData.state}
            onChange={e => setFormData(prev => ({ ...prev, state: e.target.value }))}
            disabled={!isEditing}
            className="input-primary"
          >
            {brazilianStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
            Data de Nascimento
          </label>
          <input
            type="date"
            id="birthDate"
            value={formData.birthDate}
            onChange={e => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
            disabled={!isEditing}
            className="input-primary"
          />
        </div>

        <div>
          <label htmlFor="initiationDate" className="block text-sm font-medium text-gray-700">
            Data de Iniciação
          </label>
          <input
            type="date"
            id="initiationDate"
            value={formData.initiationDate}
            onChange={e => setFormData(prev => ({ ...prev, initiationDate: e.target.value }))}
            disabled={!isEditing}
            className="input-primary"
          />
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end">
          <button type="submit" className="btn-primary flex items-center">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </button>
        </div>
      )}
    </form>
  );
}