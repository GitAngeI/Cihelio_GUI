import { supabase } from './supabase';

// 1. Función para INYECTAR un nuevo mensaje
export async function enviarMensaje(texto, remitente) {
    const { data, error } = await supabase
        .from('mensajes') // Nombre de tu tabla en Supabase
        .insert([
            { contenido: texto, rol: remitente } 
        ]);

    if (error) {
        console.error("Hubo un error al enviar:", error);
        return false;
    }
    console.log("¡Mensaje guardado al cien!", data);
    return true;
}

// 2. Función para EXTRAER el historial del chat
export async function obtenerMensajes() {
    const { data, error } = await supabase
        .from('mensajes')
        .select('*')
        .order('created_at', { ascending: true }); // Acomoda del más viejo al más nuevo

    if (error) {
        console.error("Error al jalar los datos:", error);
        return [];
    }
    console.log("Historial descargado:", data);
    return data;
}