import { useState, useEffect } from 'react';
import { Plus, Eye, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminOrders() {
  const [ordersList, setOrdersList] = useState<any[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<any | null>(null);

  // 1. LEER PEDIDOS
  const fetchPedidos = async () => {
    // Jalamos los datos del pedido y el nombre del cliente asociado
    const { data } = await supabase.from('pedido').select('*, cliente(nombre)').order('pedidoid', { ascending: true });
    if (data) setOrdersList(data);
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  // 2. CREAR PEDIDO
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const nuevoPedido = {
      clienteid: formData.get('clienteid') ? parseInt(formData.get('clienteid') as string) : null,
      fecha: formData.get('fecha'),
      total: parseFloat(formData.get('total') as string),
      estado: formData.get('estado')
    };

    await supabase.from('pedido').insert([nuevoPedido]);
    setIsAddModalOpen(false);
    fetchPedidos();
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
        <h1 className="text-3xl font-bold text-gray-800">PEDIDOS</h1>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors shadow-sm">
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
                <td className="px-6 py-4 text-gray-600">
                  {order.cliente?.nombre || `Cliente #${order.clienteid}`}
                </td>
                <td className="px-6 py-4 text-gray-600">{new Date(order.fecha).toLocaleDateString('es-MX', { timeZone: 'UTC' })}</td>
                <td className="px-6 py-4 text-right font-semibold text-green-600">
                  ${Number(order.total).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.estado)}`}>
                    {order.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => setViewingOrder(order)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm inline-flex items-center gap-2 transition-colors">
                    <Eye className="w-4 h-4" /> Ver Detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL NUEVO PEDIDO */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-green-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Registrar Nuevo Pedido</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="hover:bg-green-700 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleCreate}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente ID</label>
                  <input required name="clienteid" type="number" placeholder="Ej. 1" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input required name="fecha" type="date" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total ($)</label>
                  <input required name="total" type="number" step="0.01" placeholder="0.00" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select name="estado" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500">
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Completado">Completado</option>
                    <option value="Entregado">Entregado</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-2 border-t">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-white bg-green-600 rounded-lg">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VER DETALLE */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Detalle del Pedido #{viewingOrder.pedidoid}</h2>
              <button onClick={() => setViewingOrder(null)} className="hover:bg-blue-700 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Cliente</p>
                  <p className="text-gray-800">{viewingOrder.cliente?.nombre || `ID: ${viewingOrder.clienteid}`}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Fecha de Registro</p>
                  <p className="text-gray-800">{new Date(viewingOrder.fecha).toLocaleDateString('es-MX', { timeZone: 'UTC' })}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Estado del Pedido</p>
                  <span className={`inline-flex items-center mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(viewingOrder.estado)}`}>
                    {viewingOrder.estado}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total</p>
                  <p className="text-green-600 font-bold text-lg">${Number(viewingOrder.total).toFixed(2)}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="text-md font-semibold mb-3">Contenido (Simulado):</h3>
                <ul className="space-y-2 opacity-70">
                  <li className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                    <div><p className="font-medium">Globos de Helio</p><p className="text-xs text-gray-500">Globos metálicos número "18"</p></div>
                    <span className="text-sm font-semibold">2x</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-end pt-4 border-t">
                <button onClick={() => setViewingOrder(null)} className="px-6 py-2 text-white bg-blue-600 rounded-lg">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}