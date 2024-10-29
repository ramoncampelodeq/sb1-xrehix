import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { User, Settings, Key, Clock } from 'lucide-react';
import PersonalInfoForm from '../components/profile/PersonalInfoForm';
import PasswordForm from '../components/profile/PasswordForm';
import ActivityLog from '../components/profile/ActivityLog';

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<'info' | 'password' | 'activity'>('info');

  const tabs = [
    { id: 'info', label: 'Informações Pessoais', icon: User },
    { id: 'password', label: 'Alterar Senha', icon: Key },
    { id: 'activity', label: 'Atividade Recente', icon: Clock },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Perfil</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  group inline-flex items-center px-6 py-4 border-b-2 font-medium text-sm
                  ${activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className={`
                  -ml-0.5 mr-2 h-5 w-5
                  ${activeTab === id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                `} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'info' && (
            <PersonalInfoForm
              initialData={{
                name: user?.name ?? '',
                email: 'usuario@exemplo.com',
                phone: '(11) 98765-4321',
                degree: user?.degree ?? 'apprentice',
                occupation: 'Engenheiro',
                address: 'Rua Exemplo, 123',
                city: 'São Paulo',
                state: 'SP',
                birthDate: '1980-01-01',
                initiationDate: '2010-01-01'
              }}
            />
          )}
          
          {activeTab === 'password' && <PasswordForm />}
          
          {activeTab === 'activity' && <ActivityLog />}
        </div>
      </div>
    </div>
  );
}