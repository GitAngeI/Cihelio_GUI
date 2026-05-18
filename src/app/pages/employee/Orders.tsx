import { useState, useEffect } from 'react';
import { Plus, Eye, Edit, X, Package, Calendar, CreditCard, Tag } from 'lucide-react';
import { useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';

export default function EmployeeOrders() {
  const navigate = useNavigate();
  const [ordersList, setOrdersList] = useState<any[]>([]);

  const [viewingOrder, setViewingOrder] = useState<any | null>(null);
  const [orderDetails, setOrderDetails] = useState<any[]>([]); // Guarda los detalles del pedido a ver
  const [updatingOrder, setUpdatingOrder] = useState<any | null>(null);

  // 1. LEER PEDIDOS
  const fetchPedidos = async () => {
    const { data } = await supabase.from('pedido').select('*, cliente(nombre)').order('pedidoid', { ascending: true });
    if (data) setOrdersList(data);
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  // 2. VER DETALLES DE UN PEDIDO (Trae los globos específicos)
  const handleView = async (order: any) => {
    setViewingOrder(order);
    const { data } = await supabase
      .from('detalle_pedido')
      .select('cantidad, producto(nombre)')
      .eq('pedidoid', order.pedidoid);
    setOrderDetails(data || []);
  };

  // 3. ACTUALIZAR ESTADO DEL PEDIDO
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nuevoEstado = formData.get('estado');
    
    await supabase.from('pedido').update({ estado: nuevoEstado }).eq('pedidoid', updatingOrder.pedidoid);
    setUpdatingOrder(null);
    fetchPedidos(); // Refrescar la tabla
  };

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
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">GESTIÓN DE PEDIDOS</h1>
        <button
          onClick={() => navigate('/empleado/crear-pedido')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Nuevo Pedido
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
            {ordersList.map((order) => (
              <tr key={order.pedidoid} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">{order.pedidoid}</td>
                <td className="px-6 py-4 text-gray-600">{order.cliente?.nombre || '-'}</td>
                <td className="px-6 py-4 text-gray-600">{new Date(order.fecha).toLocaleDateString('es-MX', { timeZone: 'UTC' })}</td>
                <td className="px-6 py-4 text-right font-semibold text-green-600">${Number(order.total).toFixed(2)}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.estado)}`}>
                    {order.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleView(order)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1">
                      <Eye className="w-4 h-4" /> Ver
                    </button>
                    <button onClick={() => setUpdatingOrder(order)} className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1">
                      <Edit className="w-4 h-4" /> Actualizar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL VER DETALLE */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-blue-600 p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 p-2 rounded-lg"><Package className="w-6 h-6" /></div>
                <div>
                  <h2 className="text-xl font-bold">Pedido #{viewingOrder.pedidoid}</h2>
                  <p className="text-xs text-blue-100">Detalles de preparación</p>
                </div>
              </div>
              <button onClick={() => setViewingOrder(null)} className="hover:bg-blue-700 p-2 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Fecha</p>
                  <p className="text-xs font-semibold text-gray-800">{new Date(viewingOrder.fecha).toLocaleDateString('es-MX', { timeZone: 'UTC' })}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Tag className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Estado</p>
                  <p className={`text-xs font-bold ${getStatusBadge(viewingOrder.estado).split(' ')[1]}`}>{viewingOrder.estado}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <CreditCard className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Total</p>
                  <p className="text-xs font-bold text-green-600">${Number(viewingOrder.total).toFixed(2)}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><div className="w-1 h-4 bg-blue-600 rounded-full"></div>Artículos a preparar</h3>
                <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
                  {orderDetails.map((detalle, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{detalle.producto?.nombre}</p>
                        <p className="text-xs text-gray-500">Unidades requeridas: {detalle.cantidad}</p>
                      </div>
                    </div>
                  ))}
                  {orderDetails.length === 0 && <p className="text-sm text-gray-500">No hay artículos registrados en este pedido.</p>}
                </div>
              </div>

              <button onClick={() => setViewingOrder(null)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-bold">Cerrar</button>
            </div>
          </div>
        </div>
      )}

     {/* MODAL ACTUALIZAR ESTADO */}
      {updatingOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="bg-amber-500 p-4 flex justify-between items-center text-white">
              <h2 className="text-lg font-bold">Actualizar Estado</h2>
              <button onClick={() => setUpdatingOrder(null)} className="hover:bg-amber-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleUpdate}>
              <div>
                <p className="text-sm text-gray-500 mb-4">Modificando el pedido <strong className="text-gray-800">#{updatingOrder.pedidoid}</strong></p>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nuevo Estado:</label>
                <select name="estado" defaultValue={updatingOrder.estado} className="w-full border border-gray-300 rounded-lg p-3 outline-none font-medium text-gray-700">
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Completado">Completado</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setUpdatingOrder(null)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg w-full">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-white bg-amber-500 rounded-lg w-full font-bold">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}