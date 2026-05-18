import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminProducts() {
  const [productsList, setProductsList] = useState<any[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<any | null>(null);

// 1. LEER PRODUCTOS Y CATEGORÍAS ENLAZADAS
  const fetchProductos = async () => {
    const { data } = await supabase.from('producto').select('*, categoria(nombre)').order('productoid', { ascending: true });
    if (data) setProductsList(data);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // 2. CREAR PRODUCTO
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const nuevoProducto = {
      nombre: formData.get('nombre'),
      tipo: formData.get('tipo'),
      precio: parseFloat(formData.get('precio') as string),
      stock: parseInt(formData.get('stock') as string)
    };

    await supabase.from('producto').insert([nuevoProducto]);
    setIsAddModalOpen(false);
    fetchProductos();
  };

  // 3. ACTUALIZAR PRODUCTO
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const datosActualizados = {
      nombre: formData.get('nombre'),
      tipo: formData.get('tipo'),
      precio: parseFloat(formData.get('precio') as string),
      stock: parseInt(formData.get('stock') as string)
    };

    await supabase.from('producto').update(datosActualizados).eq('productoid', editingProduct.productoid);
    setEditingProduct(null);
    fetchProductos();
  };

  // 4. ELIMINAR PRODUCTO
  const handleDelete = async () => {
    await supabase.from('producto').delete().eq('productoid', deletingProduct.productoid);
    setDeletingProduct(null);
    fetchProductos();
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">PRODUCTOS</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Agregar Producto
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Precio</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Stock</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productsList.map((product) => (
              <tr key={product.productoid} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">{product.productoid}</td>
                <td className="px-6 py-4 text-gray-600">{product.nombre}</td>
                <td className="px-6 py-4 text-gray-600">{product.tipo}</td>
                <td className="px-6 py-4 text-right font-semibold text-green-600">
                  ${product.precio.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    product.stock > 100 ? 'bg-green-100 text-green-800' :
                    product.stock > 50 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setEditingProduct(product)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1 transition-colors">
                      <Edit className="w-4 h-4" /> Editar
                    </button>
                    <button onClick={() => setDeletingProduct(product)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1 transition-colors">
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
              <h2 className="text-xl font-bold">Agregar Producto</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="hover:bg-green-700 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleCreate}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                <input required name="nombre" type="text" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <input name="tipo" type="text" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                  <input required name="precio" type="number" step="0.01" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Inicial</label>
                  <input required name="stock" type="number" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
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
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Editar Producto</h2>
              <button onClick={() => setEditingProduct(null)} className="hover:bg-blue-700 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleUpdate}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                <input required name="nombre" defaultValue={editingProduct.nombre} type="text" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <input name="tipo" defaultValue={editingProduct.tipo} type="text" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                  <input required name="precio" defaultValue={editingProduct.precio} type="number" step="0.01" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input required name="stock" defaultValue={editingProduct.stock} type="number" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-2 border-t">
                <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg">Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}

{/* MODAL ELIMINAR */}
      {deletingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
            <div className="flex justify-center mb-4"><div className="bg-red-100 p-3 rounded-full text-red-600"><AlertTriangle className="w-8 h-8" /></div></div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">¿Eliminar Producto?</h2>
            <p className="text-gray-600 mb-6">Estás a punto de eliminar <strong>{deletingProduct.nombre}</strong>.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeletingProduct(null)} className="px-4 py-2 bg-gray-200 rounded-lg w-full">Cancelar</button>
              <button onClick={handleDelete} className="px-4 py-2 text-white bg-red-600 rounded-lg w-full">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}