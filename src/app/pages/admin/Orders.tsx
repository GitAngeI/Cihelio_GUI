import { useState } from 'react';
import { Plus, Eye } from 'lucide-react';
import { pedidos, getClienteById, getNombreCompleto } from '../../data/mockData';
import { Pedido } from '../../types';

export default function AdminOrders() {
  const [ordersList] = useState<Pedido[]>(pedidos);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'En Proceso': 'bg-blue-100 text-blue-800',
      'Completado': 'bg-green-100 text-green-800',
      'Entregado': 'bg-purple-100 text-purple-800',
      'Cancelado': 'bg-red-100 text-red-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">PEDIDOS</h1>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nuevo Pedido
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cliente</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Estado</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ordersList.map((order) => {
              const cliente = getClienteById(order.clienteID);
              
              return (
                <tr key={order.pedidoID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-800">{order.pedidoID}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {cliente ? getNombreCompleto(cliente.nombre) : '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{new Date(order.fecha).toLocaleDateString('es-MX')}</td>
                  <td className="px-6 py-4 text-right font-semibold text-green-600">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.estado)}`}>
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
    </div>
  );
}