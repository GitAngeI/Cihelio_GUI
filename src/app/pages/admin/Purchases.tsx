import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, X, AlertTriangle } from 'lucide-react';
import { compras, getProveedorById, getUsuarioById, getNombreCompleto } from '../../data/mockData';
import { Compra } from '../../types';

export default function AdminPurchases() {
  const [purchasesList] = useState<Compra[]>(compras);

  // Variables para controlar las 4 ventanas emergentes
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingPurchase, setViewingPurchase] = useState<Compra | null>(null);
  const [editingPurchase, setEditingPurchase] = useState<Compra | null>(null);
  const [deletingPurchase, setDeletingPurchase] = useState<Compra | null>(null);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'En Proceso': 'bg-blue-100 text-blue-800',
      'Recibida': 'bg-green-100 text-green-800',
      'Cancelada': 'bg-red-100 text-red-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">COMPRAS</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Nueva Compra
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Proveedor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Usuario</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Estado</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {purchasesList.map((purchase) => {
              const proveedor = getProveedorById(purchase.proveedorID);
              const usuario = getUsuarioById(purchase.usuarioID);
              
              return (
                <tr key={purchase.compraID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-800">{purchase.compraID}</td>
                  <td className="px-6 py-4 text-gray-600">{proveedor?.empresa}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(purchase.fecha).toLocaleDateString('es-MX')}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {usuario ? getNombreCompleto(usuario.nombre) : '-'}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-green-600">
                    ${purchase.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(purchase.estado)}`}>
                      {purchase.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setViewingPurchase(purchase)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </button>
                      <button 
                        onClick={() => setEditingPurchase(purchase)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                      <button 
                        onClick={() => setDeletingPurchase(purchase)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 1. VENTANA: NUEVA COMPRA */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-green-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Registrar Nueva Compra</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="hover:bg-green-700 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Compra ID</label>
                  <input type="text" placeholder="Autogenerado" disabled className="w-full border border-gray-300 bg-gray-50 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input type="date" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor ID</label>
                  <input type="text" placeholder="Ej. 1" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usuario ID</label>
                  <input type="text" placeholder="Ej. 2" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total ($)</label>
                  <input type="number" step="0.01" placeholder="0.00" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none">
                    <option>Pendiente</option>
                    <option>En Proceso</option>
                    <option>Recibida</option>
                    <option>Cancelada</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm">Guardar Compra</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. VENTANA: VER COMPRA */}
      {viewingPurchase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-green-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Detalle de Compra #{viewingPurchase.compraID}</h2>
              <button onClick={() => setViewingPurchase(null)} className="hover:bg-green-700 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Proveedor ID</p>
                  <p className="text-gray-800">{viewingPurchase.proveedorID}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Usuario ID (Solicitante)</p>
                  <p className="text-gray-800">{viewingPurchase.usuarioID}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total</p>
                  <p className="text-green-600 font-semibold">${viewingPurchase.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Fecha</p>
                  <p className="text-gray-800">{new Date(viewingPurchase.fecha).toLocaleDateString('es-MX')}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 font-medium">Estado</p>
                  <span className={`inline-flex items-center mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(viewingPurchase.estado)}`}>
                    {viewingPurchase.estado}
                  </span>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={() => setViewingPurchase(null)} className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. VENTANA: EDITAR COMPRA */}
      {editingPurchase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Editar Compra #{editingPurchase.compraID}</h2>
              <button onClick={() => setEditingPurchase(null)} className="hover:bg-blue-700 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setEditingPurchase(null); }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor ID</label>
                  <input type="text" defaultValue={editingPurchase.proveedorID} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usuario ID</label>
                  <input type="text" defaultValue={editingPurchase.usuarioID} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total ($)</label>
                  <input type="number" step="0.01" defaultValue={editingPurchase.total} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select defaultValue={editingPurchase.estado} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option>Pendiente</option>
                    <option>En Proceso</option>
                    <option>Recibida</option>
                    <option>Cancelada</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setEditingPurchase(null)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. VENTANA: ELIMINAR COMPRA */}
      {deletingPurchase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full text-red-600">
                <AlertTriangle className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">¿Eliminar Compra?</h2>
            <p className="text-gray-600 mb-6">
              Estás a punto de eliminar la compra <strong>#{deletingPurchase.compraID}</strong> por <strong>${deletingPurchase.total.toFixed(2)}</strong>. Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setDeletingPurchase(null)} 
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors w-full"
              >
                Cancelar
              </button>
              <button 
                onClick={() => setDeletingPurchase(null)} 
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm w-full"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}