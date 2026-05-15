import { useNavigate } from 'react-router';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  userEmail: string;
  userName?: string;
}

export default function Header({ userEmail, userName }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <header className="bg-blue-600 text-white px-6 py-4 flex items-center justify-end">
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm">{userEmail}</p>
          {userName && <p className="text-xs text-blue-200">{userName}</p>}
        </div>
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-lg font-bold">
            {userEmail.charAt(0).toUpperCase()}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          title="Cerrar sesión"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}