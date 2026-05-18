import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminProviders() {
  const [providersList, setProvidersList] = useState<any[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<any | null>(null);
  const [deletingProvider, setDeletingProvider] = useState<any | null>(null);

  // 1. LEER PROVEEDORES
  const fetchProveedores = async () => {
    const { data } = await supabase.from('proveedor').select('*').order('proveedorid', { ascending: true });
    if (data) setProvidersList(data);
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  // 2. CREAR PROVEEDOR
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nuevoProveedor = {
      empresa: formData.get('empresa'),
      telefono: formData.get('telefono'),
      calle: formData.get('calle'),
      numero: formData.get('numero'),
      ciudad: formData.get('ciudad')
    };
    await supabase.from('proveedor').insert([nuevoProveedor]);
    setIsAddModalOpen(false);
    fetchProveedores();
  };

  // 3. ACTUALIZAR PROVEEDOR
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const datosActualizados = {
      empresa: formData.get('empresa'),
      telefono: formData.get('telefono'),
      calle: formData.get('calle'),
      numero: formData.get('numero'),
      ciudad: formData.get('ciudad')
    };
    await supabase.from('proveedor').update(datosActualizados).eq('proveedorid', editingProvider.proveedorid);
    setEditingProvider(null);
    fetchProveedores();
  };

  // 4. ELIMINAR PROVEEDOR
  const handleDelete = async () => {
    await supabase.from('proveedor').delete().eq('proveedorid', deletingProvider.proveedorid);
    setDeletingProvider(null);
    fetchProveedores();
  };

 return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">PROVEEDORES</h1>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2">
          <Plus className="w-5 h-5" /> Agregar Proveedor
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
              <tr key={provider.proveedorid} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">{provider.proveedorid}</td>
                <td className="px-6 py-4 text-gray-600">{provider.empresa}</td>
                <td className="px-6 py-4 text-gray-600">{provider.telefono}</td>
                <td className="px-6 py-4 text-gray-600">
                  {provider.calle} #{provider.numero}, {provider.ciudad}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setEditingProvider(provider)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1">
                      <Edit className="w-4 h-4" /> Editar
                    </button>
                    <button onClick={() => setDeletingProvider(provider)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1">
                      <Trash2 className="w-4 h-4" /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL AGREGAR */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-green-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Agregar Proveedor</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="hover:bg-green-700 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleCreate}>
              <div>
                <label className="block text-sm font-medium mb-1">Nombre de la Empresa</label>
                <input required name="empresa" type="text" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Teléfono</label>
                <input required name="telefono" type="text" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Calle</label>
                  <input name="calle" type="text" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Número</label>
                  <input name="numero" type="text" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ciudad</label>
                <input name="ciudad" type="text" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-2 border-t">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-white bg-green-600 rounded-lg">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {editingProvider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Editar Proveedor</h2>
              <button onClick={() => setEditingProvider(null)} className="hover:bg-blue-700 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleUpdate}>
              <div>
                <label className="block text-sm font-medium mb-1">Nombre de la Empresa</label>
                <input required name="empresa" defaultValue={editingProvider.empresa} type="text" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Teléfono</label>
                <input required name="telefono" defaultValue={editingProvider.telefono} type="text" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Calle</label>
                  <input name="calle" defaultValue={editingProvider.calle} type="text" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Número</label>
                  <input name="numero" defaultValue={editingProvider.numero} type="text" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ciudad</label>
                <input name="ciudad" defaultValue={editingProvider.ciudad} type="text" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-2 border-t">
                <button type="button" onClick={() => setEditingProvider(null)} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg">Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}

     {/* MODAL ELIMINAR */}
      {deletingProvider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
            <div className="flex justify-center mb-4"><div className="bg-red-100 p-3 rounded-full text-red-600"><AlertTriangle className="w-8 h-8" /></div></div>
            <h2 className="text-xl font-bold mb-2">¿Eliminar Proveedor?</h2>
            <p className="text-gray-600 mb-6">Estás a punto de eliminar a <strong>{deletingProvider.empresa}</strong>.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeletingProvider(null)} className="px-4 py-2 bg-gray-200 rounded-lg w-full">Cancelar</button>
              <button onClick={handleDelete} className="px-4 py-2 text-white bg-red-600 rounded-lg w-full">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}