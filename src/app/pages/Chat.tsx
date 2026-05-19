import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';

// AQUÍ IMPORTAMOS LAS FUNCIONES DE TU COMPAÑERO
// Nota: Ajusta la ruta ('../../chatService') dependiendo de en qué carpeta guardó él ese archivo
import { enviarMensaje, obtenerMensajes } from '../../chatService'; 

interface Message {
  id: string | number;
  text: string;
  sender: 'user' | 'other';
  time: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Obtener mensajes de la base de datos al abrir el chat
  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        // Usamos la función que programó tu compañero
        const data = await obtenerMensajes(); 
        
        if (data) {
          const formattedMessages: Message[] = data.map((msg: any) => ({
  id: msg.id,
  text: msg.text,
  // Aquí está el secreto: agregamos 'as "user" | "other"'
  sender: (msg.sender_id === 'TU_ID_DE_USUARIO' ? 'user' : 'other') as "user" | "other",
  time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}));

setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Error al cargar mensajes:", error);
      }
    };

    cargarHistorial();
  }, []);

  // Auto-scroll para que baje automáticamente cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 2. Enviar mensaje usando la lógica de tu compañero
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que se recargue la página
    if (inputText.trim() === '') return;

    try {
      // Mandamos el mensaje a Supabase usando la función de tu compañero
      await enviarMensaje(inputText, 'TU_ID_DE_USUARIO'); 
      
      // Actualizamos la pantalla de inmediato para que el usuario vea su mensaje
      const nuevoMensaje: Message = {
        id: Date.now(),
        text: inputText,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages((prev) => [...prev, nuevoMensaje]);
      setInputText(''); // Limpiamos la caja de texto
      
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };

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
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              msg.sender === 'user' ? 'bg-blue-500 text-white font-bold text-xs' : 'bg-gray-300'
            }`}>
              {msg.sender === 'user' ? 'Tú' : <User className="w-5 h-5 text-gray-600" />}
            </div>

            <div className={`p-3 rounded-2xl max-w-[75%] shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-blue-100 text-blue-900 rounded-br-none' 
                : 'bg-gray-200 text-gray-800 rounded-bl-none'
            }`}>
              <p className="text-sm">{msg.text}</p>
              <span className={`text-[10px] mt-1 block text-right ${
                msg.sender === 'user' ? 'text-blue-500' : 'text-gray-500'
              }`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        {/* Referencia para el auto-scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* Caja de texto inferior (Input) */}
      <div className="p-4 bg-white border-t border-gray-200">
        {/* Aquí conectamos la función de enviar al formulario */}
        <form className="flex gap-2" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Escribe un mensaje aquí..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
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