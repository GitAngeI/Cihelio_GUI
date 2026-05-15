import { Outlet } from 'react-router';
import { Home, ShoppingCart, Package, MessageSquare } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function ClientLayout() {
  const menuItems = [
    { icon: Home, label: 'Catálogo', path: '/cliente' },
    { icon: ShoppingCart, label: 'Carrito', path: '/cliente/carrito' },
    { icon: Package, label: 'Mis Pedidos', path: '/cliente/pedidos' },
    { icon: MessageSquare, label: 'Chat', path: '/cliente/chat' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar items={menuItems} />
      <div className="flex-1 flex flex-col">
        <Header userEmail="cliente@example.com" userName="Cliente" />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}