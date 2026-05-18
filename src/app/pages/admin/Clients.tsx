import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminClients() {
  const [clientsList, setClientsList] = useState<any[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [deletingClient, setDeletingClient] = useState<any | null>(null);

// 1. LEER (READ)
  const fetchClientes = async () => {
    const { data } = await supabase.from('cliente').select('*').order('clienteid', { ascending: true });
    if (data) setClientsList(data);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // 2. CREAR (CREATE)
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const nuevoCliente = {
      nombre: formData.get('nombre'),
      telefono: formData.get('telefono'),
      correo: formData.get('correo')
    };

    await supabase.from('cliente').insert([nuevoCliente]);
    setIsAddModalOpen(false);
    fetchClientes(); 
  };

  // 3. ACTUALIZAR (UPDATE)
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const datosActualizados = {
      nombre: formData.get('nombre'),
      telefono: formData.get('telefono'),
      correo: formData.get('correo')
    };

    await supabase.from('cliente').update(datosActualizados).eq('clienteid', editingClient.clienteid);
    setEditingClient(null);
    fetchClientes();
  };

  // 4. ELIMINAR (DELETE)
  const handleDelete = async () => {
    await supabase.from('cliente').delete().eq('clienteid', deletingClient.clienteid);
    setDeletingClient(null);
    fetchClientes();
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">CLIENTES</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Agregar Cliente
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Teléfono</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Correo</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clientsList.map((client) => (
              <tr key={client.clienteid} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">{client.clienteid}</td>
                <td className="px-6 py-4 text-gray-600">{client.nombre}</td>
                <td className="px-6 py-4 text-gray-600">{client.telefono}</td>
                <td className="px-6 py-4 text-gray-600">{client.correo}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setEditingClient(client)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1 transition-colors">
                      <Edit className="w-4 h-4" /> Editar
                    </button>
                    <button onClick={() => setDeletingClient(client)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1 transition-colors">
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
              <h2 className="text-xl font-bold">Agregar Cliente</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="hover:bg-green-700 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleCreate}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input required name="nombre" type="text" placeholder="Ej. Ana Martínez Hernández" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input name="telefono" placeholder="81-1234-5678" type="text" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                  <input required name="correo" placeholder="correo@example.com" type="email" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-2 border-t">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-white bg-green-600 rounded-lg">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

     {/* MODAL EDITAR */}
      {editingClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Editar Cliente</h2>
              <button onClick={() => setEditingClient(null)} className="hover:bg-blue-700 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleUpdate}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input required name="nombre" defaultValue={editingClient.nombre} type="text" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input name="telefono" defaultValue={editingClient.telefono} type="text" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                  <input required name="correo" defaultValue={editingClient.correo} type="email" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-2 border-t">
                <button type="button" onClick={() => setEditingClient(null)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg">Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}

{/* MODAL ELIMINAR */}
      {deletingClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
            <div className="flex justify-center mb-4"><div className="bg-red-100 p-3 rounded-full text-red-600"><AlertTriangle className="w-8 h-8" /></div></div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">¿Eliminar Cliente?</h2>
            <p className="text-gray-600 mb-6">Estás a punto de eliminar a <strong>{deletingClient.nombre}</strong>.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeletingClient(null)} className="px-4 py-2 bg-gray-200 rounded-lg w-full">Cancelar</button>
              <button onClick={handleDelete} className="px-4 py-2 text-white bg-red-600 rounded-lg w-full">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}