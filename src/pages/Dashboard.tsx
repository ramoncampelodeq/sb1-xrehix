import React from 'react';
import { Users, Calendar, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useSessionStore } from '../stores/sessionStore';
import { useMemberStore } from '../stores/memberStore';
import { useTreasuryStore } from '../stores/treasuryStore';
import StatCard from '../components/dashboard/StatCard';
import UpcomingEvents from '../components/dashboard/UpcomingEvents';
import BirthdayList from '../components/dashboard/BirthdayList';
import AttendanceHistory from '../components/dashboard/AttendanceHistory';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const sessions = useSessionStore((state) => state.sessions);
  const members = useMemberStore((state) => state.members);
  const { getDuesStatus } = useTreasuryStore();

  // Get current month's sessions
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const sessionsThisMonth = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate.getMonth() === currentMonth && 
           sessionDate.getFullYear() === currentYear;
  });

  // Calculate late payments
  const latePaymentsCount = members.reduce((count, member) => {
    const duesStatus = getDuesStatus(member.id, currentMonth, currentYear);
    return duesStatus.status === 'late' ? count + 1 : count;
  }, 0);

  // Calculate attendance rate
  const attendanceRate = sessions.length > 0
    ? Math.round(
        (sessions.reduce(
          (sum, session) => sum + (session.attendees.length / members.length),
          0
        ) / sessions.length) * 100
      )
    : 0;

  // Get upcoming sessions
  const upcomingSessions = sessions
    .filter(session => new Date(session.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Bem-vindo, {user?.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Aqui está um resumo das informações mais importantes
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Irmãos"
          value={members.length}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Sessões este Mês"
          value={sessionsThisMonth.length}
          icon={Calendar}
          color="bg-green-500"
        />
        <StatCard
          title="Inadimplentes"
          value={latePaymentsCount}
          icon={AlertTriangle}
          color="bg-red-500"
        />
        <StatCard
          title="Taxa de Presença"
          value={`${attendanceRate}%`}
          icon={TrendingUp}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {user?.role === 'admin' ? (
          <>
            <UpcomingEvents sessions={upcomingSessions} />
            <BirthdayList members={members} />
          </>
        ) : (
          <>
            <UpcomingEvents sessions={upcomingSessions} />
            <AttendanceHistory sessions={sessions} memberId={user?.id ?? 0} />
          </>
        )}
      </div>
    </div>
  );
}