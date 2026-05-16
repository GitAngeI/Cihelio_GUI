import { useState } from 'react';
import { Plus, Eye, Edit, X, Package, Calendar, CreditCard, Tag } from 'lucide-react';
import { useNavigate } from 'react-router';
import { pedidos, getClienteById, getNombreCompleto, getDetallesPorPedido, productos } from '../../data/mockData';
import { Pedido, EstadoPedido } from '../../types';

export default function EmployeeOrders() {
  const navigate = useNavigate();
  const [ordersList] = useState<Pedido[]>(pedidos);

  // Variables para controlar las ventanas emergentes del Empleado
  const [viewingOrder, setViewingOrder] = useState<Pedido | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<Pedido | null>(null);

  const getStatusBadge = (status: EstadoPedido) => {
    const statusConfig = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'En Proceso': 'bg-blue-100 text-blue-800',
      'Completado': 'bg-green-100 text-green-800',
      'Entregado': 'bg-purple-100 text-purple-800',
      'Cancelado': 'bg-red-100 text-red-800'
    };
    return statusConfig[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">GESTIÓN DE PEDIDOS</h1>
        <button
          onClick={() => navigate('/empleado/crear-pedido')}
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
              const cliente = getClienteById(order.clienteID);
              
              return (
                <tr key={order.pedidoID} className="hover:bg-gray-50 transition-colors">
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
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setViewingOrder(order)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </button>
                      <button 
                        onClick={() => setUpdatingOrder(order)}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Actualizar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* VENTANA EMERGENTE 1: VER DETALLE (Solo lectura) */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform animate-in zoom-in-95 duration-300">
            <div className="bg-blue-600 p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Pedido #{viewingOrder.pedidoID}</h2>
                  <p className="text-xs text-blue-100">Detalles de preparación</p>
                </div>
              </div>
              <button onClick={() => setViewingOrder(null)} className="hover:bg-blue-700 p-2 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Fecha</p>
                  <p className="text-xs font-semibold text-gray-800">{new Date(viewingOrder.fecha).toLocaleDateString()}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Tag className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Estado</p>
                  <p className={`text-xs font-bold ${getStatusBadge(viewingOrder.estado).split(' ')[1]}`}>
                    {viewingOrder.estado}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <CreditCard className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Total</p>
                  <p className="text-xs font-bold text-green-600">${viewingOrder.total.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                  Artículos a preparar
                </h3>
                <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
                  {getDetallesPorPedido(viewingOrder.pedidoID).map((detalle, idx) => {
                    const producto = productos.find(p => p.productoID === detalle.productoID);
                    return (
                      <div key={idx} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{producto?.nombre || 'Producto Desconocido'}</p>
                          <p className="text-xs text-gray-500">Unidades requeridas: {detalle.cantidad}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button 
                onClick={() => setViewingOrder(null)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-bold transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VENTANA EMERGENTE 2: ACTUALIZAR ESTADO */}
      {updatingOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform animate-in zoom-in-95 duration-300">
            <div className="bg-amber-500 p-4 flex justify-between items-center text-white">
              <h2 className="text-lg font-bold">Actualizar Estado</h2>
              <button onClick={() => setUpdatingOrder(null)} className="hover:bg-amber-600 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setUpdatingOrder(null); }}>
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Modificando el pedido <strong className="text-gray-800">#{updatingOrder.pedidoID}</strong>
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nuevo Estado:</label>
                <select 
                  defaultValue={updatingOrder.estado}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none font-medium text-gray-700"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Completado">Completado</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setUpdatingOrder(null)} 
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors w-full"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors shadow-sm w-full font-bold"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}