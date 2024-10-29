import React, { useState } from 'react';
import { Plus, Users, FileText, Edit2, Trash2 } from 'lucide-react';
import { useSessionStore } from '../stores/sessionStore';
import { useMemberStore } from '../stores/memberStore';
import SessionForm from '../components/sessions/SessionForm';
import AttendanceForm from '../components/sessions/AttendanceForm';
import { Session } from '../types/session';
import { format } from 'date-fns';

function Sessions() {
  const [showForm, setShowForm] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  
  const { sessions, addSession, updateSession, deleteSession, addAttendee, removeAttendee } = useSessionStore();
  const members = useMemberStore(state => state.members);

  const handleSubmit = (data: any) => {
    if (editingSession) {
      updateSession(editingSession.id, data);
    } else {
      addSession(data);
    }
    setShowForm(false);
    setEditingSession(null);
  };

  const handleEdit = (session: Session) => {
    setEditingSession(session);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta sessão?')) {
      deleteSession(id);
    }
  };

  const handleAttendance = (session: Session) => {
    setSelectedSession(session);
    setShowAttendance(true);
  };

  const handleToggleAttendance = (memberId: number, present: boolean) => {
    if (!selectedSession) return;
    
    if (present) {
      addAttendee(selectedSession.id, memberId);
    } else {
      removeAttendee(selectedSession.id, memberId);
    }
  };

  const getAttendanceCount = (session: Session) => {
    return session.attendees.length;
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Sessões</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie as sessões da Loja
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Sessão
        </button>
      </div>

      {showForm ? (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium mb-4">
              {editingSession ? 'Editar Sessão' : 'Nova Sessão'}
            </h2>
            <SessionForm
              initialData={editingSession ?? undefined}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingSession(null);
              }}
            />
          </div>
        </div>
      ) : showAttendance && selectedSession ? (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <AttendanceForm
              session={selectedSession}
              onToggleAttendance={handleToggleAttendance}
              onClose={() => {
                setShowAttendance(false);
                setSelectedSession(null);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grau
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ordem do Dia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Presença
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(new Date(session.date), 'dd/MM/yyyy')}
                    </div>
                    <div className="text-sm text-gray-500">{session.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {session.degree === 'apprentice' && 'Aprendiz'}
                      {session.degree === 'fellowcraft' && 'Companheiro'}
                      {session.degree === 'master' && 'Mestre'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-2">
                      {session.agenda}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getAttendanceCount(session)} presentes
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleAttendance(session)}
                      className="text-green-600 hover:text-green-900 mr-3"
                      title="Registrar Presença"
                    >
                      <Users className="w-5 h-5" />
                    </button>
                    {session.minutesUrl && (
                      <a
                        href={session.minutesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 mr-3"
                        title="Ver Balaustre"
                      >
                        <FileText className="w-5 h-5" />
                      </a>
                    )}
                    <button
                      onClick={() => handleEdit(session)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Editar"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(session.id)}
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
      )}
    </div>
  );
}

export default Sessions;