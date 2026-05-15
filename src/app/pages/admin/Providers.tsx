import { useState } from 'react';
import { Plus, Edit, Trash2, X, AlertTriangle } from 'lucide-react';
import { proveedores, getDireccionCompleta } from '../../data/mockData';
import { Proveedor } from '../../types';

export default function AdminProviders() {
  const [providersList] = useState<Proveedor[]>(proveedores);

  // Variables para controlar las ventanas emergentes
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Proveedor | null>(null);
  const [deletingProvider, setDeletingProvider] = useState<Proveedor | null>(null);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">PROVEEDORES</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Agregar Proveedor
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Empresa</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Teléfono</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Dirección</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {providersList.map((provider) => (
              <tr key={provider.proveedorID} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">{provider.proveedorID}</td>
                <td className="px-6 py-4 text-gray-600">{provider.empresa}</td>
                <td className="px-6 py-4 text-gray-600">{provider.telefono}</td>
                <td className="px-6 py-4 text-gray-600">{getDireccionCompleta(provider.direccion)}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => setEditingProvider(provider)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                    <button 
                      onClick={() => setDeletingProvider(provider)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 1. VENTANA PARA AGREGAR PROVEEDOR */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-green-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Agregar Proveedor</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="hover:bg-green-700 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID (Opcional)</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección Completa</label>
                <textarea rows={2} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. VENTANA PARA EDITAR PROVEEDOR */}
      {editingProvider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Editar Proveedor</h2>
              <button onClick={() => setEditingProvider(null)} className="hover:bg-blue-700 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setEditingProvider(null); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                <input type="text" defaultValue={editingProvider.proveedorID} disabled className="w-full border border-gray-300 bg-gray-50 rounded-lg p-2 outline-none text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa</label>
                <input type="text" defaultValue={editingProvider.empresa} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input type="text" defaultValue={editingProvider.telefono} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección Completa</label>
                <textarea rows={2} defaultValue={getDireccionCompleta(editingProvider.direccion)} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setEditingProvider(null)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. VENTANA PARA ELIMINAR PROVEEDOR */}
      {deletingProvider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full text-red-600">
                <AlertTriangle className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">¿Eliminar Proveedor?</h2>
            <p className="text-gray-600 mb-6">
              Estás a punto de eliminar a <strong>{deletingProvider.empresa}</strong>. Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setDeletingProvider(null)} 
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors w-full"
              >
                Cancelar
              </button>
              <button 
                onClick={() => setDeletingProvider(null)} 
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