import React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Session } from '../../types/session';

interface UpcomingEventsProps {
  sessions: Session[];
}

export default function UpcomingEvents({ sessions }: UpcomingEventsProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-6 py-5">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Próximas Sessões
        </h3>
        <div className="space-y-4">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <div key={session.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(session.date), "dd 'de' MMMM', às' HH:mm")}
                    </p>
                    <p className="text-sm text-gray-500">
                      Sessão de{' '}
                      {session.degree === 'apprentice' && 'Aprendiz'}
                      {session.degree === 'fellowcraft' && 'Companheiro'}
                      {session.degree === 'master' && 'Mestre'}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-md p-3">
                  <p className="text-sm text-gray-600 line-clamp-2">{session.agenda}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Não há sessões agendadas</p>
          )}
        </div>
      </div>
    </div>
  );
}