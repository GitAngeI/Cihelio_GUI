import { NavLink } from 'react-router';
import { LucideIcon } from 'lucide-react';
import logo from '../../imports/image.png';

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
}

export default function Sidebar({ items, title = "Cihelio Pop" }: SidebarProps) {
  return (
    <div className="w-64 bg-blue-600 min-h-screen text-white flex flex-col">
      <div className="p-4 flex items-center gap-3 border-b border-blue-500">
        <img src={logo} alt="Cihelio Pop" className="w-32 h-auto" />
      </div>
      
      <nav className="flex-1 py-4">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 hover:bg-blue-700 transition-colors ${
                isActive ? 'bg-blue-700' : ''
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
