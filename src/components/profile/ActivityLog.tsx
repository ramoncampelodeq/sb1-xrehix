import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LogIn, FileText, CreditCard, Settings } from 'lucide-react';

interface Activity {
  id: number;
  type: 'login' | 'document' | 'payment' | 'profile';
  description: string;
  date: string;
}

const activities: Activity[] = [
  {
    id: 1,
    type: 'login',
    description: 'Login realizado com sucesso',
    date: '2024-03-10T08:30:00'
  },
  {
    id: 2,
    type: 'document',
    description: 'Visualizou o balaustre da última sessão',
    date: '2024-03-09T14:15:00'
  },
  {
    id: 3,
    type: 'payment',
    description: 'Pagamento da mensalidade registrado',
    date: '2024-03-08T10:45:00'
  },
  {
    id: 4,
    type: 'profile',
    description: 'Atualizou informações do perfil',
    date: '2024-03-07T16:20:00'
  }
];

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'login':
      return <LogIn className="h-5 w-5 text-blue-500" />;
    case 'document':
      return <FileText className="h-5 w-5 text-green-500" />;
    case 'payment':
      return <CreditCard className="h-5 w-5 text-purple-500" />;
    case 'profile':
      return <Settings className="h-5 w-5 text-gray-500" />;
  }
};

export default function ActivityLog() {
  return (
    <div className="space-y-6">
      <div className="flow-root">
        <ul className="-mb-8">
          {activities.map((activity, activityIdx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== activities.length - 1 ? (
                  <span
                    className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center ring-8 ring-white">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {activity.description}
                        </p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {format(new Date(activity.date), "dd 'de' MMMM 'às' HH:mm", {
                          locale: ptBR
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}