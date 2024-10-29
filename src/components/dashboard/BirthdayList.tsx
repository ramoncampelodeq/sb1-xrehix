import React from 'react';
import { Cake } from 'lucide-react';
import { Member } from '../../types/member';
import { format, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BirthdayListProps {
  members: Member[];
}

export default function BirthdayList({ members }: BirthdayListProps) {
  const currentMonth = new Date();
  const birthdays = members
    .filter(member => {
      const birthDate = new Date(member.birthday);
      return isSameMonth(birthDate, currentMonth);
    })
    .sort((a, b) => {
      const dateA = new Date(a.birthday);
      const dateB = new Date(b.birthday);
      return dateA.getDate() - dateB.getDate();
    });

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-6 py-5">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Aniversariantes de {format(currentMonth, 'MMMM', { locale: ptBR })}
        </h3>
        <div className="mt-4 divide-y divide-gray-100">
          {birthdays.length > 0 ? (
            birthdays.map((member) => (
              <div key={member.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Cake className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(member.birthday), "dd 'de' MMMM", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <span className="text-lg">🎂</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 py-3">
              Nenhum aniversariante este mês
            </p>
          )}
        </div>
      </div>
    </div>
  );
}