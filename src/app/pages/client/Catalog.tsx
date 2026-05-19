import { useState, useEffect } from 'react';
import { Plus, ShoppingCart, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { supabase } from '../../lib/supabase';

// Imágenes de productos desde Unsplash
const productImages: {[key: number]: string} = {
  1: 'https://images.unsplash.com/photo-1693651199295-2dee5af42919?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGJhbGxvb25zJTIwcGFydHl8ZW58MXx8fHwxNzc0MjI1MzM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  2: 'https://images.unsplash.com/photo-1693651199295-2dee5af42919?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGJhbGxvb25zJTIwcGFydHl8ZW58MXx8fHwxNzc0MjI1MzM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  3: 'https://images.unsplash.com/photo-1693651199295-2dee5af42919?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGJhbGxvb25zJTIwcGFydHl8ZW58MXx8fHwxNzc0MjI1MzM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  4: 'https://images.unsplash.com/photo-1612896008575-32623e0acb79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWxpdW0lMjBiYWxsb29ucyUyMGZsb2F0aW5nfGVufDF8fHx8MTc3NDIyNTMzNnww&ixlib=rb-4.1.0&q=80&w=1080',
  5: 'https://images.unsplash.com/photo-1612896008575-32623e0acb79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWxpdW0lMjBiYWxsb29ucyUyMGZsb2F0aW5nfGVufDF8fHx8MTc3NDIyNTMzNnww&ixlib=rb-4.1.0&q=80&w=1080',
  6: 'https://images.unsplash.com/photo-1598622443054-499119043e82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGJhbGxvb25zJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzc0MjI1MzM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  7: 'https://images.unsplash.com/photo-1598622443054-499119043e82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGJhbGxvb25zJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzc0MjI1MzM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  8: 'https://images.unsplash.com/photo-1598622443054-499119043e82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGJhbGxvb25zJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzc0MjI1MzM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  9: 'https://images.unsplash.com/photo-1598622443054-499119043e82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGJhbGxvb25zJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzc0MjI1MzM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  10: 'https://images.unsplash.com/photo-1769374077145-cff000d91633?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxsb29uJTIwYm91cXVldCUyMGRlY29yYXRpb258ZW58MXx8fHwxNzc0MjI1MzM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  11: 'https://images.unsplash.com/photo-1598622443054-499119043e82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGJhbGxvb25zJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzc0MjI1MzM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  12: 'https://images.unsplash.com/photo-1769374077145-cff000d91633?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxsb29uJTIwYm91cXVldCUyMGRlY29yYXRpb258ZW58MXx8fHwxNzc0MjI1MzM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
};

export default function Catalog() {
  // El carrito ahora guarda el objeto completo del producto
  const [cart, setCart] = useState<{[key: number]: any}>({});
  const [productosDb, setProductosDb] = useState<any[]>([]);
  
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // 1. CARGAR PRODUCTOS Y CARRITO GUARDADO
  useEffect(() => {
    // Leemos si el usuario ya tenía cosas en su carrito
    const savedCart = localStorage.getItem('cihelio_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const fetchProductos = async () => {
      const { data } = await supabase.from('producto').select('*');
      if (data) setProductosDb(data);
    };
    fetchProductos();
  }, []);

  // 2. LÓGICA REAL PARA AGREGAR AL CARRITO
  const addToCart = (product: any) => {
    setCart(prev => {
      const newCart = { ...prev };
      
      // Si el globo ya estaba en el carrito, le sumamos 1 a la cantidad
      if (newCart[product.productoid]) {
        newCart[product.productoid].cantidad += 1;
      } else {
        // Si no estaba, guardamos toda su información
        newCart[product.productoid] = {
          productoid: product.productoid,
          nombre: product.nombre,
          precio: Number(product.precio),
          cantidad: 1
        };
      }
      
      // GUARDAMOS EN LOCALSTORAGE
      localStorage.setItem('cihelio_cart', JSON.stringify(newCart));
      return newCart;
    });
    
    setToastMessage(`¡${product.nombre} agregado al carrito!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const cartCount = Object.values(cart).reduce((sum: any, item: any) => sum + item.cantidad, 0);
  
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Catálogo de Globos</h1>
        <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm">
          <ShoppingCart className="w-5 h-5" />
          <span className="font-semibold">{cartCount} productos</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productosDb.map((product) => {
          return (
            <div key={product.productoid} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 overflow-hidden bg-gray-200">
                <ImageWithFallback
                  src={productImages[product.productoid] || productImages[1]}
                  alt={product.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                  {product.tipo}
                </span>
                <h3 className="text-lg font-semibold mt-2 text-gray-800">{product.nombre}</h3>
                <p className="text-sm text-gray-600 mt-1">{product.tipo}</p>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-2xl font-bold text-green-600">${Number(product.precio).toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                  </div>
                  <button
                    // Pasamos el objeto completo a la función
                    onClick={() => addToCart(product)}
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors shadow-sm"
                    disabled={product.stock === 0}
                    title="Agregar al carrito"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {cart[product.productoid] && (
                  <div className="mt-3 text-center bg-green-50 text-green-700 border border-green-100 py-1 rounded text-sm font-medium">
                    {cart[product.productoid].cantidad} en el carrito
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* NOTIFICACIÓN FLOTANTE (TOAST) */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-up z-50">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}