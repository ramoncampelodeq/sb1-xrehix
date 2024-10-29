import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { 
  Users, 
  Calendar, 
  PiggyBank, 
  UserCircle, 
  LogOut,
  LayoutDashboard,
  Compass
} from 'lucide-react';

function Layout() {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Irmãos', href: '/members', icon: Users },
    { name: 'Sessões', href: '/sessions', icon: Calendar },
    { name: 'Tesouraria', href: '/treasury', icon: PiggyBank },
    { name: 'Perfil', href: '/profile', icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
              <div className="flex items-center flex-shrink-0 px-4 mb-5">
                <Compass className="w-8 h-8 text-blue-600" />
                <span className="ml-2 text-xl font-semibold text-gray-800">ULC 114</span>
              </div>
              <nav className="flex-1 space-y-1 bg-white">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      } group flex items-center px-4 py-2 text-sm font-medium`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="flex-shrink-0 p-4 border-t">
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout;