import { useState, useEffect } from 'react';
import { Plus, Eye, CheckCircle, XCircle, Clock, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminPayments() {
  const [paymentsList, setPaymentsList] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);

  // 1. LEER PAGOS
  const fetchPagos = async () => {
    // Jalamos los datos del pago y también el nombre del cliente a través del pedido
    const { data } = await supabase
      .from('pago')
      .select('*, pedido(cliente(nombre))')
      .order('pagoid', { ascending: true });
    
    if (data) setPaymentsList(data);
  };

  useEffect(() => {
    fetchPagos();
  }, []);

  // 2. CREAR PAGO
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const nuevoPago = {
      pedidoid: parseInt(formData.get('pedidoid') as string),
      monto: parseFloat(formData.get('monto') as string),
      fecha: formData.get('fecha'),
      tipo: formData.get('tipo'),
      estado: formData.get('estado')
    };

    await supabase.from('pago').insert([nuevoPago]);
    setIsModalOpen(false);
    fetchPagos();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completado': return <CheckCircle className="w-3 h-3" />;
      case 'Pendiente': return <Clock className="w-3 h-3" />;
      case 'Rechazado': return <XCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Completado': 'bg-green-100 text-green-800',
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'Rechazado': 'bg-red-100 text-red-800',
      'Reembolsado': 'bg-purple-100 text-purple-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">PAGOS</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2">
          <Plus className="w-5 h-5" /> Registrar Pago
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Pedido</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cliente</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Monto</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Método</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Estado</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paymentsList.map((payment) => (
              <tr key={payment.pagoid} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">{payment.pagoid}</td>
                <td className="px-6 py-4 text-gray-600">#{payment.pedidoid}</td>
                <td className="px-6 py-4 text-gray-600">{payment.pedido?.cliente?.nombre || '-'}</td>
                <td className="px-6 py-4 text-right font-semibold text-green-600">
                  ${Number(payment.monto).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-gray-600">{new Date(payment.fecha).toLocaleDateString('es-MX', { timeZone: 'UTC' })}</td>
                <td className="px-6 py-4 text-gray-600">{payment.tipo}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(payment.estado)}`}>
                    {getStatusIcon(payment.estado)} {payment.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => setSelectedPayment(payment)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm inline-flex items-center gap-2">
                    <Eye className="w-4 h-4" /> Ver Detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL REGISTRAR PAGO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-green-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Registrar Nuevo Pago</h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-green-700 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleCreate}>
              <div>
                <label className="block text-sm font-medium mb-1">ID del Pedido</label>
                <input required name="pedidoid" type="number" className="w-full border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Monto ($)</label>
                <input required name="monto" type="number" step="0.01" className="w-full border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fecha</label>
                <input required name="fecha" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full border p-2 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Método / Tipo</label>
                  <select name="tipo" className="w-full border p-2 rounded-lg">
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estado</label>
                  <select name="estado" className="w-full border p-2 rounded-lg">
                    <option value="Completado">Completado</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Rechazado">Rechazado</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-white bg-green-600 rounded-lg">Guardar Pago</button>
              </div>
            </form>
          </div>
        </div>
      )}

     {/* MODAL VER DETALLE */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Detalle del Pago #{selectedPayment.pagoid}</h2>
              <button onClick={() => setSelectedPayment(null)} className="hover:bg-blue-700 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">ID del Pago</p><p>{selectedPayment.pagoid}</p></div>
                <div><p className="text-sm text-gray-500">ID del Pedido</p><p>#{selectedPayment.pedidoid}</p></div>
                <div><p className="text-sm text-gray-500">Monto</p><p className="text-green-600 font-semibold">${Number(selectedPayment.monto).toFixed(2)}</p></div>
                <div><p className="text-sm text-gray-500">Fecha</p><p>{new Date(selectedPayment.fecha).toLocaleDateString('es-MX', { timeZone: 'UTC' })}</p></div>
                <div><p className="text-sm text-gray-500">Método de Pago</p><p>{selectedPayment.tipo}</p></div>
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold mt-1 ${getStatusBadge(selectedPayment.estado)}`}>
                    {getStatusIcon(selectedPayment.estado)} {selectedPayment.estado}
                  </span>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t"><button onClick={() => setSelectedPayment(null)} className="px-4 py-2 text-white bg-blue-600 rounded-lg">Cerrar</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}