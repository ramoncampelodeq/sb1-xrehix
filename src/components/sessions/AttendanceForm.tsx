import React, { useState, useEffect } from 'react';
import { useMemberStore } from '../../stores/memberStore';
import { Session } from '../../types/session';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Users } from 'lucide-react';

interface AttendanceFormProps {
  session: Session;
  onToggleAttendance: (memberId: number, present: boolean) => void;
  onClose: () => void;
}

export default function AttendanceForm({ session, onToggleAttendance, onClose }: AttendanceFormProps) {
  const members = useMemberStore(state => state.members);
  const [attendanceCount, setAttendanceCount] = useState(session.attendees.length);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members
    .filter(member => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.degree.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleToggle = (memberId: number, checked: boolean) => {
    onToggleAttendance(memberId, checked);
    setAttendanceCount(prev => checked ? prev + 1 : prev - 1);
  };

  useEffect(() => {
    setAttendanceCount(session.attendees.length);
  }, [session.attendees]);

  const getDegreeLabel = (degree: string) => {
    switch (degree) {
      case 'apprentice': return 'Apr∴';
      case 'fellowcraft': return 'Comp∴';
      case 'master': return 'M∴';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Lista de Presença
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {format(new Date(session.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Users className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-sm font-medium text-blue-700">
            Presenças: {attendanceCount} de {members.length} irmãos
          </span>
        </div>
        <span className="text-sm text-blue-600">
          {((attendanceCount / members.length) * 100).toFixed(1)}%
        </span>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Buscar irmão..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grau
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Presente
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {member.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getDegreeLabel(member.degree)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <input
                    type="checkbox"
                    checked={session.attendees.includes(member.id)}
                    onChange={(e) => handleToggle(member.id, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="btn-primary"
        >
          Concluir
        </button>
      </div>
    </div>
  );
}