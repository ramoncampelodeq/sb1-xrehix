import React from 'react';
import { Calendar } from 'lucide-react';
import { Session } from '../../types/session';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AttendanceHistoryProps {
  sessions: Session[];
  memberId: number;
}

export default function AttendanceHistory({ sessions, memberId }: AttendanceHistoryProps) {
  const attendedSessions = sessions
    .filter(session => session.attendees.includes(memberId))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-6 py-5">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Histórico de Presenças
        </h3>
        <div className="space-y-4">
          {attendedSessions.length > 0 ? (
            attendedSessions.map((session) => (
              <div key={session.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(session.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                    <p className="text-sm text-gray-500">
                      Sessão de{' '}
                      {session.degree === 'apprentice' && 'Aprendiz'}
                      {session.degree === 'fellowcraft' && 'Companheiro'}
                      {session.degree === 'master' && 'Mestre'}
                    </p>
                  </div>
                </div>
                {session.minutesUrl && (
                  <div className="mt-2 ml-8">
                    <a
                      href={session.minutesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Ver Balaustre
                    </a>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              Nenhuma presença registrada
            </p>
          )}
        </div>
      </div>
    </div>
  );
}