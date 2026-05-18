import { useState } from 'react';
import { Eye, Package, X, Calendar, CreditCard, Tag } from 'lucide-react';
import { pedidos, getDetallesPorPedido, productos } from '../../data/mockData';
import { Pedido, EstadoPedido } from '../../types';

const statusColors: Record<EstadoPedido, string> = {
  'Pendiente': 'bg-yellow-100 text-yellow-800',
  'En Proceso': 'bg-blue-100 text-blue-800',
  'Completado': 'bg-green-100 text-green-800',
  'Entregado': 'bg-purple-100 text-purple-800',
  'Cancelado': 'bg-red-100 text-red-800'
};

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<Pedido | null>(null);
  
  // Filtrar solo los pedidos del cliente actual (clienteID: 1 para ejemplo)
  const clientOrders = pedidos.filter(p => p.clienteid === 1);

  return (
    <div className="relative">
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
                const detalles = getDetallesPorPedido(order.pedidoid);
                const totalItems = detalles.reduce((sum, d) => sum + d.cantidad, 0);
                
                return (
                  <tr key={order.pedidoid} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-800">#{order.pedidoid}</td>
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
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2 transition-all shadow-sm"
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
      )}

      {/* VENTANA EMERGENTE: DETALLE DEL PEDIDO (CLIENTE) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform animate-in zoom-in-95 duration-300">
            {/* Encabezado */}
            <div className="bg-blue-600 p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Pedido #{selectedOrder.pedidoid}</h2>
                  <p className="text-xs text-blue-100">Consulta los detalles de tu compra</p>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="hover:bg-blue-700 p-2 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Resumen Rápido */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Fecha</p>
                  <p className="text-xs font-semibold text-gray-800">{new Date(selectedOrder.fecha).toLocaleDateString()}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Tag className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Estado</p>
                  <p className={`text-xs font-bold ${statusColors[selectedOrder.estado].split(' ')[1]}`}>
                    {selectedOrder.estado}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <CreditCard className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Total</p>
                  <p className="text-xs font-bold text-green-600">${selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>

              {/* Lista de Productos Reales */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                  Artículos en este pedido
                </h3>
                <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
                  {getDetallesPorPedido(selectedOrder.pedidoid).map((detalle, idx) => {
                    const producto = productos.find(p => p.productoid === detalle.productoid);
                    return (
                      <div key={idx} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{producto?.nombre || 'Producto'}</p>
                          <p className="text-xs text-gray-500">Cantidad: {detalle.cantidad}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-700">
                           ${Number((producto?.precio || 0) * detalle.cantidad).toFixed(2)}
                           </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
              >
                Cerrar Historial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}