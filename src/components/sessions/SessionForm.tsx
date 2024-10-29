import React from 'react';
import { Session, SessionFormData } from '../../types/session';

interface SessionFormProps {
  initialData?: Session;
  onSubmit: (data: SessionFormData) => void;
  onCancel: () => void;
}

function SessionForm({ initialData, onSubmit, onCancel }: SessionFormProps) {
  const [formData, setFormData] = React.useState<SessionFormData>(() => ({
    date: initialData?.date ?? '',
    time: initialData?.time ?? '',
    degree: initialData?.degree ?? 'apprentice',
    agenda: initialData?.agenda ?? '',
    minutesUrl: initialData?.minutesUrl ?? ''
  }));

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
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">
            Horário
          </label>
          <input
            type="time"
            id="time"
            required
            value={formData.time}
            onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
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
              degree: e.target.value as Session['degree']
            }))}
            className="input-primary"
          >
            <option value="apprentice">Aprendiz</option>
            <option value="fellowcraft">Companheiro</option>
            <option value="master">Mestre</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="agenda" className="block text-sm font-medium text-gray-700">
            Ordem do Dia
          </label>
          <textarea
            id="agenda"
            required
            rows={4}
            value={formData.agenda}
            onChange={e => setFormData(prev => ({ ...prev, agenda: e.target.value }))}
            className="input-primary"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="minutesUrl" className="block text-sm font-medium text-gray-700">
            URL do Balaustre (PDF)
          </label>
          <input
            type="url"
            id="minutesUrl"
            value={formData.minutesUrl}
            onChange={e => setFormData(prev => ({ ...prev, minutesUrl: e.target.value }))}
            className="input-primary"
            placeholder="https://..."
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

export default SessionForm;