import { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface CartItem {
  productoid: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. CARGAR EL CARRITO REAL
  useEffect(() => {
    // Leemos exactamente lo que el usuario agregó en el Catálogo
    const savedCart = localStorage.getItem('cihelio_cart');
    if (savedCart) {
      const cartObj = JSON.parse(savedCart);
      // Convertimos el objeto { 1: {...}, 2: {...} } en un arreglo [ {...}, {...} ] para la tabla
      setItems(Object.values(cartObj)); 
    }
  }, []);

  // Función para mantener la memoria sincronizada si borramos o agregamos desde aquí
  const syncLocalStorage = (newItems: CartItem[]) => {
    const cartObj = newItems.reduce((acc, item) => ({...acc, [item.productoid]: item}), {});
    localStorage.setItem('cihelio_cart', JSON.stringify(cartObj));
  };

  const updateQuantity = (id: number, delta: number) => {
    const newItems = items.map(item => 
      item.productoid === id 
        ? { ...item, cantidad: Math.max(1, item.cantidad + delta) }
        : item
    );
    setItems(newItems);
    syncLocalStorage(newItems);
  };

  const removeItem = (id: number) => {
    const newItems = items.filter(item => item.productoid !== id);
    setItems(newItems);
    syncLocalStorage(newItems);
  };

  const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  // 2. PROCESAR COMPRA REAL EN BASE DE DATOS
  const handleFinishPurchase = async () => {
    setLoading(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      let currentClienteId = 1; // Cliente por defecto para demostración
      
      if (authData.user?.email) {
        const { data: clienteData } = await supabase
          .from('cliente')
          .select('clienteid')
          .eq('correo', authData.user.email)
          .maybeSingle();

        if (clienteData) currentClienteId = clienteData.clienteid;
      }

      // A. Crear el Pedido Maestro
      const { data: nuevoPedido, error: pedidoError } = await supabase
        .from('pedido')
        .insert([{
          clienteid: currentClienteId,
          total: total,
          estado: 'Pendiente',
          fecha: new Date().toISOString().split('T')[0]
        }])
        .select()
        .single();

      if (pedidoError) throw pedidoError;

      // B. Insertar cada globo del carrito en el detalle del pedido
      const detalles = items.map(item => ({
        pedidoid: nuevoPedido.pedidoid,
        productoid: item.productoid,
        cantidad: item.cantidad,
        precio_venta: item.precio,
        subtotal: item.precio * item.cantidad
      }));

      const { error: detallesError } = await supabase.from('detalle_pedido').insert(detalles);
      if (detallesError) throw detallesError;

      // C. Restar el stock en la base de datos
      for (const item of items) {
         const { data: prod } = await supabase.from('producto').select('stock').eq('productoid', item.productoid).single();
         if (prod) {
           await supabase.from('producto').update({ stock: prod.stock - item.cantidad }).eq('productoid', item.productoid);
         }
      }

      // D. Vaciar el carrito en pantalla y en memoria
      setItems([]);
      localStorage.removeItem('cihelio_cart');
      setIsSuccessModalOpen(true);

    } catch (error) {
      console.error("Error al finalizar la compra:", error);
      alert("Hubo un error al conectar con el servidor para procesar tu pedido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Carrito de Compras</h1>

      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center border border-gray-100">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium text-lg">Tu carrito está vacío</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Producto</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Cantidad</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Precio</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Total</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item.productoid} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{item.nombre}</p>
                      <p className="text-xs text-gray-400">ID: {item.productoid}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3 bg-white border rounded-lg p-1 w-max mx-auto shadow-sm">
                        <button onClick={() => updateQuantity(item.productoid, -1)} className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold w-6 text-center text-gray-800">{item.cantidad}</span>
                        <button onClick={() => updateQuantity(item.productoid, 1)} className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600 font-medium">${item.precio.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-bold text-green-600">
                      ${(item.precio * item.cantidad).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => removeItem(item.productoid)} className="text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-all shadow-sm">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Total a Pagar</p>
              <p className="text-4xl font-black text-green-600">${total.toFixed(2)}</p>
            </div>
            <button 
              onClick={handleFinishPurchase}
              disabled={loading}
              className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingBag className="w-5 h-5" />}
              {loading ? 'Procesando Pago...' : 'Finalizar Compra'}
            </button>
          </div>
        </div>
      )}

      {/* VENTANA EMERGENTE: ÉXITO DE COMPRA */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-5 rounded-full">
                  <CheckCircle className="w-14 h-14 text-green-600" />
                </div>
              </div>
              <h2 className="text-3xl font-black text-gray-800 mb-2">¡Pedido Realizado!</h2>
              <p className="text-gray-600 mb-8 font-medium">
                Tu compra se ha guardado en la base de datos con éxito y el stock de inventario ha sido actualizado.
              </p>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8 text-left">
                <p className="text-sm text-blue-800 font-bold mb-2">Próximos pasos en el sistema:</p>
                <ul className="text-sm text-blue-700 space-y-2 list-disc list-inside">
                  <li>El pedido aparecerá como "Pendiente" en el panel de empleados.</li>
                  <li>Ya puedes visualizarlo en la pantalla de Pedidos del administrador.</li>
                </ul>
              </div>
              <button 
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-colors shadow-md"
              >
                Volver a la Tienda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}