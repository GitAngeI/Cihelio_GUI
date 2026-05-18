import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function EmployeeProducts() {
  const [productsList, setProductsList] = useState<any[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<any | null>(null);

  // 1. LEER PRODUCTOS DE SUPABASE
  const fetchProductos = async () => {
    const { data } = await supabase
      .from('producto')
      .select('*')
      .order('productoid', { ascending: true });
    if (data) setProductsList(data);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // 2. CREAR NUEVO PRODUCTO
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

  // 3. ACTUALIZAR PRODUCTO EXISTENTE
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
        <h1 className="text-3xl font-bold text-gray-800">INVENTARIO DE PRODUCTOS</h1>
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre del Globo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Precio</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Stock</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productsList.map((product) => (
              <tr key={product.productoid} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-800">{product.productoid}</td>
                <td className="px-6 py-4 text-gray-600">{product.nombre}</td>
                <td className="px-6 py-4 text-gray-600">{product.tipo}</td>
                <td className="px-6 py-4 text-right font-semibold text-green-600">
                  ${Number(product.precio).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    product.stock > 100 ? 'bg-green-100 text-green-800' :
                    product.stock > 50 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.stock} u.
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
            {productsList.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No hay productos registrados en el inventario.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VENTANA 1: AGREGAR PRODUCTO (Empleado) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-green-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Agregar Producto</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="hover:bg-green-700 p-1 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleCreate}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                <input required name="nombre" type="text" placeholder="Ej. Globo Metálico Estrella" className="w-full border border-gray-300 p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <input required name="tipo" type="text" placeholder="Ej. Metálico, Látex, Personaje" className="w-full border border-gray-300 p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio Unitario ($)</label>
                  <input required name="precio" type="number" step="0.01" placeholder="0.00" className="w-full border border-gray-300 p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Inicial</label>
                  <input required name="stock" type="number" placeholder="Ej. 100" className="w-full border border-gray-300 p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm">Guardar Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VENTANA 2: EDITAR PRODUCTO (Empleado) */}
      {/* MODAL: ELIMINAR PRODUCTO */}
      {deletingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full text-red-600">
                <AlertTriangle className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">¿Eliminar Producto?</h2>
            <p className="text-gray-600 mb-6">
              Estás a punto de eliminar el producto <strong>{deletingProduct.nombre}</strong>. Esta acción borrará este globo de la base de datos y no se puede deshacer.
            </p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setDeletingProduct(null)} 
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors w-full font-medium"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete} 
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm w-full font-medium"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}