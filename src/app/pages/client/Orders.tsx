import { useState, useEffect } from 'react';
import { Eye, X, Package, Calendar, CreditCard, Tag } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ClientOrders() {
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [viewingOrder, setViewingOrder] = useState<any | null>(null);
  const [orderDetails, setOrderDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. LEER LOS PEDIDOS REALES DEL CLIENTE DESDE SUPABASE
  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        let currentClienteId = 1; // ID por defecto que sincroniza con el flujo del Carrito

        if (authData.user?.email) {
          const { data: clienteData } = await supabase
            .from('cliente')
            .select('clienteid')
            .eq('correo', authData.user.email)
            .maybeSingle();

          if (clienteData) currentClienteId = clienteData.clienteid;
        }

        // Consultamos únicamente las compras que pertenecen a este cliente específico
        const { data } = await supabase
          .from('pedido')
          .select('*')
          .eq('clienteid', currentClienteId)
          .order('pedidoid', { ascending: false }); // Las compras más recientes aparecen arriba

        if (data) setOrdersList(data);
      } catch (error) {
        console.error('Error al cargar tus pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  // 2. LEER EL DESGLOSE DE PRODUCTOS DE UN PEDIDO SELECCIONADO
  const handleViewDetails = async (order: any) => {
    setViewingOrder(order);
    const { data } = await supabase
      .from('detalle_pedido')
      .select('cantidad, precio_venta, subtotal, producto(nombre)')
      .eq('pedidoid', order.pedidoid);
    
    setOrderDetails(data || []);
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

  if (loading) {
    return <div className="text-center py-12 text-gray-500 font-medium">Cargando tus pedidos...</div>;
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mis Pedidos</h1>
          <p className="text-sm text-gray-500 mt-1">Historial de tus compras y estado de preparación</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID Pedido</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fecha</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Total</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Estado</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ordersList.map((order) => (
              <tr key={order.pedidoid} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-800">#{order.pedidoid}</td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(order.fecha).toLocaleDateString('es-MX', { timeZone: 'UTC' })}
                </td>
                <td className="px-6 py-4 text-right font-bold text-green-600">
                  ${Number(order.total).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(order.estado)}`}>
                    {order.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2 transition-all shadow-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
            {ordersList.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  Aún no has realizado ningún pedido. ¡Ve al catálogo y adorna tus momentos!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

          {/* MODAL: VER DETALLE COMPLETO DEL PEDIDO */}
          {viewingOrder && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform animate-in zoom-in-95 duration-300">
                <div className="bg-blue-600 p-5 flex justify-between items-center text-white">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Pedido #{viewingOrder.pedidoid}</h2>
                      <p className="text-xs text-blue-100">Resumen de tu compra</p>
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
                      <p className="text-xs font-semibold text-gray-800">
                        {new Date(viewingOrder.fecha).toLocaleDateString('es-MX', { timeZone: 'UTC' })}
                      </p>
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
                      <p className="text-xs font-bold text-green-600">${Number(viewingOrder.total).toFixed(2)}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                      Artículos comprados
                    </h3>
                    <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
                      {orderDetails.map((detalle, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{detalle.producto?.nombre || 'Globo'}</p>
                            <p className="text-xs text-gray-400">Precio unitario: ${Number(detalle.precio_venta).toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-800">x{detalle.cantidad}</p>
                            <p className="text-xs font-bold text-green-600">${Number(detalle.subtotal).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                      {orderDetails.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-2">Cargando desglose de productos...</p>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => setViewingOrder(null)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-md"
                  >
                    Cerrar Resumen
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
}