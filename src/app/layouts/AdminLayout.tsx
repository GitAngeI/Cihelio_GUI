import { Outlet } from 'react-router';
import { Home, Users, ShoppingBag, Package, ShoppingCart, Truck, CreditCard, MessageSquare } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function AdminLayout() {
  const menuItems = [
    { icon: Home, label: 'Inicio', path: '/admin' },
    { icon: Users, label: 'Clientes', path: '/admin/clientes' },
    { icon: ShoppingBag, label: 'Productos', path: '/admin/productos' },
    { icon: Package, label: 'Pedidos', path: '/admin/pedidos' },
    { icon: ShoppingCart, label: 'Compras', path: '/admin/compras' },
    { icon: Truck, label: 'Proveedores', path: '/admin/proveedores' },
    { icon: CreditCard, label: 'Pagos', path: '/admin/pagos' },
    { icon: MessageSquare, label: 'Chat', path: '/admin/chat' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar items={menuItems} />
      <div className="flex-1 flex flex-col">
        <Header userEmail="admin@admin.com" userName="Administrador" />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}