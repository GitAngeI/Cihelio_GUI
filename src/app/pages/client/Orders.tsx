import { Eye, Package } from 'lucide-react';
import { pedidos, getDetallesPorPedido } from '../../data/mockData';
import { Pedido, EstadoPedido } from '../../types';

const statusColors: Record<EstadoPedido, string> = {
  'Pendiente': 'bg-yellow-100 text-yellow-800',
  'En Proceso': 'bg-blue-100 text-blue-800',
  'Completado': 'bg-green-100 text-green-800',
  'Entregado': 'bg-purple-100 text-purple-800',
  'Cancelado': 'bg-red-100 text-red-800'
};

export default function Orders() {
  // Filtrar solo los pedidos del cliente actual (clienteID: 1 para ejemplo)
  const clientOrders = pedidos.filter(p => p.clienteID === 1);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Pedidos</h1>

      {clientOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No tienes pedidos aún</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Productos</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Estado</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clientOrders.map((order) => {
                const detalles = getDetallesPorPedido(order.pedidoID);
                const totalItems = detalles.reduce((sum, d) => sum + d.cantidad, 0);
                
                return (
                  <tr key={order.pedidoID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-800">#{order.pedidoID}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(order.fecha).toLocaleDateString('es-MX')}</td>
                    <td className="px-6 py-4 text-gray-600">{totalItems} productos</td>
                    <td className="px-6 py-4 text-right font-semibold text-green-600">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.estado]}`}>
                        {order.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm inline-flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}