import { useState } from 'react';
import { Plus, Eye, CheckCircle, XCircle, Clock, X } from 'lucide-react';
import { pagos, pedidos, getClienteById, getNombreCompleto } from '../../data/mockData';
import { Pago } from '../../types';

export default function AdminPayments() {
  const [paymentsList] = useState<Pago[]>(pagos);
  
  // Variable para la ventana verde (Crear)
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // NUEVA Variable para la ventana azul (Ver Detalle) - Guarda el pago seleccionado
  const [selectedPayment, setSelectedPayment] = useState<Pago | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completado':
        return <CheckCircle className="w-3 h-3" />;
      case 'Pendiente':
        return <Clock className="w-3 h-3" />;
      case 'Rechazado':
        return <XCircle className="w-3 h-3" />;
      default:
        return null;
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
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Registrar Pago
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
            {paymentsList.map((payment) => {
              const pedido = pedidos.find(p => p.pedidoID === payment.pedidoID);
              const cliente = pedido ? getClienteById(pedido.clienteID) : null;
              
              return (
                <tr key={payment.pagoID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-800">{payment.pagoID}</td>
                  <td className="px-6 py-4 text-gray-600">#{payment.pedidoID}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {cliente ? getNombreCompleto(cliente.nombre) : '-'}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-green-600">
                    ${payment.monto.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{new Date(payment.fecha).toLocaleDateString('es-MX')}</td>
                  <td className="px-6 py-4 text-gray-600">{payment.tipo}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(payment.estado)}`}>
                      {getStatusIcon(payment.estado)}
                      {payment.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* Le agregamos el evento onClick al botón azul, mandándole los datos de ESTA fila */}
                    <button 
                      onClick={() => setSelectedPayment(payment)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm inline-flex items-center gap-2"
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

      {/* VENTANA EMERGENTE (MODAL) PARA REGISTRAR PAGO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-green-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Registrar Nuevo Pago</h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-green-700 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form 
              className="p-6 space-y-4" 
              onSubmit={(e) => {
                e.preventDefault();
                setIsModalOpen(false);
                alert("¡Simulación exitosa! Aquí los de BD conectarán su código para guardar el pago.");
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID del Pedido</label>
                <input type="text" placeholder="Ej. 5" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto ($)</label>
                <input type="number" step="0.01" placeholder="0.00" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input type="date" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Método / Tipo</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>Efectivo</option>
                    <option>Tarjeta</option>
                    <option>Transferencia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>Completado</option>
                    <option>Pendiente</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm">
                  Guardar Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NUEVA VENTANA EMERGENTE (MODAL) PARA VER DETALLE */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Detalle del Pago #{selectedPayment.pagoID}</h2>
              <button onClick={() => setSelectedPayment(null)} className="hover:bg-blue-700 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">ID del Pago</p>
                  <p className="text-gray-800">{selectedPayment.pagoID}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">ID del Pedido</p>
                  <p className="text-gray-800">#{selectedPayment.pedidoID}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Monto</p>
                  <p className="text-green-600 font-semibold">${selectedPayment.monto.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Fecha</p>
                  <p className="text-gray-800">{new Date(selectedPayment.fecha).toLocaleDateString('es-MX')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Método de Pago</p>
                  <p className="text-gray-800">{selectedPayment.tipo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Estado</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold mt-1 ${getStatusBadge(selectedPayment.estado)}`}>
                    {getStatusIcon(selectedPayment.estado)}
                    {selectedPayment.estado}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-4 mt-4 border-t border-gray-100">
                <button onClick={() => setSelectedPayment(null)} className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
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