import React, { useState } from 'react';
import { Eye, EyeOff, Key } from 'lucide-react';

export default function PasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      // TODO: Implement API call to change password
      setSuccess('Senha alterada com sucesso!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError('Erro ao alterar a senha. Tente novamente.');
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
          {success}
        </div>
      )}

      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
          Senha Atual
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type={showPasswords.current ? 'text' : 'password'}
            id="currentPassword"
            required
            value={formData.currentPassword}
            onChange={e => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
            className="input-primary pr-10"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('current')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPasswords.current ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
          Nova Senha
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type={showPasswords.new ? 'text' : 'password'}
            id="newPassword"
            required
            value={formData.newPassword}
            onChange={e => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
            className="input-primary pr-10"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('new')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPasswords.new ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirmar Nova Senha
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type={showPasswords.confirm ? 'text' : 'password'}
            id="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="input-primary pr-10"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirm')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPasswords.confirm ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary flex items-center">
          <Key className="w-4 h-4 mr-2" />
          Alterar Senha
        </button>
      </div>
    </form>
  );
}