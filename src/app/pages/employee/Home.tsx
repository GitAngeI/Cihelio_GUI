import { Package, ShoppingBag, TrendingUp, Clock } from 'lucide-react';

export default function EmployeeHome() {
  const stats = [
    { label: 'Pedidos Hoy', value: '12', icon: Package, color: 'bg-blue-500' },
    { label: 'Productos', value: '45', icon: ShoppingBag, color: 'bg-green-500' },
    { label: 'Ventas del Día', value: '$2,400', icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Pendientes', value: '5', icon: Clock, color: 'bg-yellow-500' },
  ];

  const recentOrders = [
    { id: 1, client: 'Juan Pérez', date: '25/04/2024', total: 200.00, status: 'pending' },
    { id: 2, client: 'María Gómez', date: '25/04/2024', total: 350.00, status: 'completed' },
    { id: 3, client: 'Carlos López', date: '25/04/2024', total: 150.00, status: 'processing' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de Empleado</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Pedidos Recientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cliente</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-800">#{order.id}</td>
                  <td className="px-6 py-4 text-gray-600">{order.client}</td>
                  <td className="px-6 py-4 text-gray-600">{order.date}</td>
                  <td className="px-6 py-4 text-right font-semibold text-green-600">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status === 'completed' ? 'Completado' :
                       order.status === 'processing' ? 'En Proceso' :
                       'Pendiente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
