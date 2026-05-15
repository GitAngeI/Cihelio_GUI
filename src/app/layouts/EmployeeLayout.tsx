import { Outlet } from 'react-router';
import { Home, Package, ShoppingBag, MessageSquare } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function EmployeeLayout() {
  const menuItems = [
    { icon: Home, label: 'Inicio', path: '/empleado' },
    { icon: Package, label: 'Pedidos', path: '/empleado/pedidos' },
    { icon: ShoppingBag, label: 'Productos', path: '/empleado/productos' },
    { icon: MessageSquare, label: 'Chat', path: '/empleado/chat' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar items={menuItems} />
      <div className="flex-1 flex flex-col">
        <Header userEmail="empleado@example.com" userName="Empleado" />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}