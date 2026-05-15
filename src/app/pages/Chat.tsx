import { MessageSquare, Send, User } from 'lucide-react';

export default function Chat() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Encabezado del Chat */}
      <div className="bg-blue-600 text-white p-4 flex items-center gap-3">
        <MessageSquare className="w-6 h-6" />
        <div>
          <h2 className="text-lg font-bold">Chat de Soporte</h2>
          <p className="text-xs text-blue-200">En línea</p>
        </div>
      </div>

      {/* Área de mensajes (Historial visual) */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
        
        {/* Mensaje Recibido */}
        <div className="flex items-end gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mb-1">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div className="bg-gray-200 text-gray-800 p-3 rounded-2xl rounded-bl-none max-w-[75%] shadow-sm">
            <p className="text-sm">¡Hola! Tengo una duda sobre los globos metálicos para un evento. ¿Qué tamaños manejan?</p>
            <span className="text-[10px] text-gray-500 mt-1 block text-right">10:00 AM</span>
          </div>
        </div>

        {/* Mensaje Enviado */}
        <div className="flex items-end gap-2 flex-row-reverse">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs mb-1">
            Tú
          </div>
          <div className="bg-blue-100 text-blue-900 p-3 rounded-2xl rounded-br-none max-w-[75%] shadow-sm">
            <p className="text-sm">¡Hola! Claro que sí, manejamos tamaños desde 18 hasta 36 pulgadas. ¿Buscas algún color en específico?</p>
            <span className="text-[10px] text-blue-500 mt-1 block text-right">10:02 AM</span>
          </div>
        </div>

      </div>

      {/* Caja de texto inferior (Input) */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Escribe un mensaje aquí..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 w-10 h-10 rounded-full transition-colors flex items-center justify-center shadow-md"
            title="Enviar mensaje"
          >
            <Send className="w-4 h-4 ml-1" />
          </button>
        </form>
      </div>

    </div>
  );
}