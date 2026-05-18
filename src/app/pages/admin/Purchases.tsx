import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, X, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminPurchases() {
  const [purchasesList, setPurchasesList] = useState<any[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingPurchase, setViewingPurchase] = useState<any | null>(null);
  const [editingPurchase, setEditingPurchase] = useState<any | null>(null);
  const [deletingPurchase, setDeletingPurchase] = useState<any | null>(null);

  // 1. LEER COMPRAS
  const fetchCompras = async () => {
    const { data } = await supabase
      .from('compra')
      .select('*, proveedor(empresa), usuario(nombre)')
      .order('compraid', { ascending: true });
    if (data) setPurchasesList(data);
  };

  useEffect(() => {
    fetchCompras();
  }, []);

  // 2. CREAR COMPRA
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nuevaCompra = {
      proveedorid: formData.get('proveedorid') ? parseInt(formData.get('proveedorid') as string) : null,
      usuarioid: formData.get('usuarioid') ? parseInt(formData.get('usuarioid') as string) : null,
      fecha: formData.get('fecha'),
      total: parseFloat(formData.get('total') as string),
      estado: formData.get('estado')
    };
    await supabase.from('compra').insert([nuevaCompra]);
    setIsAddModalOpen(false);
    fetchCompras();
  };

  // 3. ACTUALIZAR COMPRA
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const datosActualizados = {
      proveedorid: formData.get('proveedorid') ? parseInt(formData.get('proveedorid') as string) : null,
      usuarioid: formData.get('usuarioid') ? parseInt(formData.get('usuarioid') as string) : null,
      fecha: formData.get('fecha'),
      total: parseFloat(formData.get('total') as string),
      estado: formData.get('estado')
    };
    await supabase.from('compra').update(datosActualizados).eq('compraid', editingPurchase.compraid);
    setEditingPurchase(null);
    fetchCompras();
  };

  // 4. ELIMINAR COMPRA
  const handleDelete = async () => {
    await supabase.from('compra').delete().eq('compraid', deletingPurchase.compraid);
    setDeletingPurchase(null);
    fetchCompras();
  };

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
        <button onClick={() => setIsAddModalOpen(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors">
          <Plus className="w-5 h-5" /> Nueva Compra
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
            {purchasesList.map((purchase) => (
              <tr key={purchase.compraid} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">{purchase.compraid}</td>
                <td className="px-6 py-4 text-gray-600">{purchase.proveedor?.empresa || `ID: ${purchase.proveedorid}`}</td>
                <td className="px-6 py-4 text-gray-600">{new Date(purchase.fecha).toLocaleDateString('es-MX', { timeZone: 'UTC' })}</td>
                <td className="px-6 py-4 text-gray-600">{purchase.usuario?.nombre || `ID: ${purchase.usuarioid}`}</td>
                <td className="px-6 py-4 text-right font-semibold text-green-600">${Number(purchase.total).toFixed(2)}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(purchase.estado)}`}>
                    {purchase.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setViewingPurchase(purchase)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1">
                      <Eye className="w-4 h-4" /> Ver
                    </button>
                    <button onClick={() => setEditingPurchase(purchase)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1">
                      <Edit className="w-4 h-4" /> Editar
                    </button>
                    <button onClick={() => setDeletingPurchase(purchase)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1">
                      <Trash2 className="w-4 h-4" /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CREAR */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-green-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Registrar Compra</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="hover:bg-green-700 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleCreate}>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Proveedor ID</label><input required name="proveedorid" type="number" className="w-full border p-2 rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">Usuario ID</label><input required name="usuarioid" type="number" className="w-full border p-2 rounded-lg" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Total ($)</label><input required name="total" type="number" step="0.01" className="w-full border p-2 rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">Fecha</label><input required name="fecha" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full border p-2 rounded-lg" /></div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <select name="estado" className="w-full border p-2 rounded-lg">
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Recibida">Recibida</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-4"><button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button><button type="submit" className="px-4 py-2 text-white bg-green-600 rounded-lg">Guardar</button></div>
            </form>
          </div>
        </div>
      )}

     {/* MODAL VER DETALLE */}
      {viewingPurchase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-green-600 p-4 flex justify-between items-center text-white"><h2 className="text-xl font-bold">Detalle de Compra</h2><button onClick={() => setViewingPurchase(null)}><X className="w-5 h-5" /></button></div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">Proveedor</p><p>{viewingPurchase.proveedor?.empresa}</p></div>
                <div><p className="text-sm text-gray-500">Usuario (Solicitante)</p><p>{viewingPurchase.usuario?.nombre}</p></div>
                <div><p className="text-sm text-gray-500">Total</p><p className="text-green-600 font-semibold">${Number(viewingPurchase.total).toFixed(2)}</p></div>
                <div><p className="text-sm text-gray-500">Fecha</p><p>{new Date(viewingPurchase.fecha).toLocaleDateString('es-MX', { timeZone: 'UTC' })}</p></div>
                <div className="col-span-2"><p className="text-sm text-gray-500">Estado</p><span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(viewingPurchase.estado)}`}>{viewingPurchase.estado}</span></div>
              </div>
              <div className="flex justify-end"><button onClick={() => setViewingPurchase(null)} className="px-4 py-2 text-white bg-green-600 rounded-lg">Cerrar</button></div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {editingPurchase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Editar Compra #{editingPurchase.compraid}</h2>
              <button onClick={() => setEditingPurchase(null)} className="hover:bg-blue-700 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleUpdate}>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Proveedor ID</label><input required name="proveedorid" defaultValue={editingPurchase.proveedorid} type="number" className="w-full border p-2 rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">Usuario ID</label><input required name="usuarioid" defaultValue={editingPurchase.usuarioid} type="number" className="w-full border p-2 rounded-lg" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Total ($)</label><input required name="total" defaultValue={editingPurchase.total} type="number" step="0.01" className="w-full border p-2 rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">Fecha</label><input required name="fecha" defaultValue={editingPurchase.fecha} type="date" className="w-full border p-2 rounded-lg" /></div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <select name="estado" defaultValue={editingPurchase.estado} className="w-full border p-2 rounded-lg">
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Recibida">Recibida</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-4"><button type="button" onClick={() => setEditingPurchase(null)} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button><button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg">Actualizar</button></div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {deletingPurchase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
            <div className="flex justify-center mb-4"><div className="bg-red-100 p-3 rounded-full text-red-600"><AlertTriangle className="w-8 h-8" /></div></div>
            <h2 className="text-xl font-bold mb-2">¿Eliminar Compra?</h2>
            <p className="text-gray-600 mb-6">Se eliminará la compra <strong>#{deletingPurchase.compraid}</strong> por <strong>${deletingPurchase.total.toFixed(2)}</strong>.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeletingPurchase(null)} className="px-4 py-2 bg-gray-200 rounded-lg w-full">Cancelar</button>
              <button onClick={handleDelete} className="px-4 py-2 text-white bg-red-600 rounded-lg w-full">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}