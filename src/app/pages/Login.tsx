import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import logo from '../../imports/image.png';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState(''); // Estado para capturar errores visuales

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      // 1. Buscar manualmente el usuario por correo y contraseña en la tabla
      const { data: usuario, error: userError } = await supabase
        .from('usuario')
        .select('*')
        .eq('correo', email)
        .eq('contrasena', password)
        .maybeSingle(); // Trae un solo registro o null si no existe

      if (userError) throw userError;

      // Si no se encontró ningún usuario con esos datos
      if (!usuario) {
        setErrorMsg('El correo o la contraseña son incorrectos.');
        return;
      }

      // 2. Si el usuario existe, comprobar si su usuarioid está en la tabla administrador
      const { data: admin, error: adminError } = await supabase
        .from('administrador')
        .select('*')
        .eq('usuarioid', usuario.usuarioid)
        .maybeSingle();

      if (adminError) throw adminError;

      // 3. Redirección inteligente basada en los roles
      if (admin) {
        navigate('/admin');
      } else if (email.includes('empleado') || email.includes('employee')) {
        navigate('/empleado');
      } else {
        navigate('/cliente');
      }

    } catch (error) {
      console.error(error);
      setErrorMsg('Error de comunicación con el servidor.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-8">
          <img src={logo} alt="Cihelio Pop" className="w-48 h-auto" />
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Cihelio Pop
        </h1>
        <p className="text-center text-gray-600 mb-8">Tienda de Globos</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-2">
              <Mail className="w-4 h-4" />
              Correo
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-2">
              <Lock className="w-4 h-4" />
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">
              {errorMsg}
            </p>
          )}
          
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Ingresar
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center mb-3">Accesos de prueba:</p>
          <div className="space-y-2 text-xs text-gray-500">
            <p>👤 Cliente: <span className="font-mono">cliente@example.com</span></p>
            <p>👨‍💼 Empleado: <span className="font-mono">empleado@example.com</span></p>
            <p>👨‍💻 Admin: <span className="font-mono">admin@example.com</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
