
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
import { enviarMensaje } from './chatService';
  createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <button 
      onClick={() => enviarMensaje("¡Fierro pariente, ya jaló el backend!", "admin")} 
      style={{ background: 'red', color: 'white', padding: '20px', fontSize: '20px', cursor: 'pointer', position: 'absolute', top: '10px', left: '10px', zIndex: 9999 }}>
        MANDAR MENSAJE DE PRUEBA
    </button>
  </>
);
  