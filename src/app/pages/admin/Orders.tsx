import { useState } from 'react';
import { Plus, Eye, X } from 'lucide-react';
import { pedidos, getClienteById, getNombreCompleto } from '../../data/mockData';
import { Pedido } from '../../types';

export default function AdminOrders() {
  const [ordersList] = useState<Pedido[]>(pedidos);

  // Variables para controlar las ventanas emergentes
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Pedido | null>(null);

  // Estados actualizados según el manual oficial
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'En preparación': 'bg-blue-100 text-blue-800',
      'Completado': 'bg-green-100 text-green-800',
      'Entregado': 'bg-purple-100 text-purple-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">PEDIDOS</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors shadow-sm"
        >
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
              const cliente = getClienteById(order.clienteid);
              
              return (
                <tr key={order.pedidoid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-800">{order.pedidoid}</td>
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
                    <button 
                      onClick={() => setViewingOrder(order)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm inline-flex items-center gap-2 transition-colors"
                    >
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

      {/* 1. VENTANA EMERGENTE: NUEVO PEDIDO */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-green-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Registrar Nuevo Pedido</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="hover:bg-green-700 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pedido ID</label>
                  <input type="text" placeholder="Autogenerado" disabled className="w-full border border-gray-300 bg-gray-50 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input type="date" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente ID</label>
                  <input type="text" placeholder="Ej. 1" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Producto ID</label>
                  <input type="text" placeholder="Ej. 3" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none">
                  <option>Pendiente</option>
                  <option>En preparación</option>
                  <option>Completado</option>
                  <option>Entregado</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm">Guardar Pedido</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. VENTANA EMERGENTE: VER DETALLE */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Detalle del Pedido #{viewingOrder.pedidoid}</h2>
              <button onClick={() => setViewingOrder(null)} className="hover:bg-blue-700 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Información General */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Cliente ID</p>
                  <p className="text-gray-800">{viewingOrder.clienteid}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Fecha de Registro</p>
                  <p className="text-gray-800">{new Date(viewingOrder.fecha).toLocaleDateString('es-MX')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Estado del Pedido</p>
                  <span className={`inline-flex items-center mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(viewingOrder.estado)}`}>
                    {viewingOrder.estado}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Acumulado</p>
                  <p className="text-green-600 font-bold text-lg">${viewingOrder.total.toFixed(2)}</p>
                </div>
              </div>

              {/* Sección de detalles específicos según el manual */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-md font-semibold text-gray-800 mb-3">Contenido del Pedido:</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div>
                      <p className="font-medium text-gray-800">Arreglos Personalizados</p>
                      <p className="text-xs text-gray-500">Bouquet de cumpleaños con temática</p>
                    </div>
                    <span className="text-sm font-semibold">1x</span>
                  </li>
                  <li className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div>
                      <p className="font-medium text-gray-800">Globos de Helio</p>
                      <p className="text-xs text-gray-500">Globos metálicos número "18"</p>
                    </div>
                    <span className="text-sm font-semibold">2x</span>
                  </li>
                  <li className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div>
                      <p className="font-medium text-gray-800">Accesorios</p>
                      <p className="text-xs text-gray-500">Base decorativa y pesas para globos</p>
                    </div>
                    <span className="text-sm font-semibold">3x</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                <button onClick={() => setViewingOrder(null)} className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}