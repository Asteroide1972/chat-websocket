// Importa las dependencias
const express = require('express');
const WebSocket = require('ws');

const app = express();
const port = 3000;

// Crea un servidor HTTP
const server = app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});

// Configura WebSocket en el servidor
const wss = new WebSocket.Server({ server });

// Maneja las conexiones WebSocket
wss.on('connection', (ws) => {
  console.log('Nuevo usuario conectado');
  
  // Envía un mensaje de bienvenida al cliente
  ws.send('Bienvenido al chat!');
  
  // Escucha los mensajes enviados por el cliente
  ws.on('message', (message) => {
    // Verificar si el mensaje es un Buffer (binario)
    if (Buffer.isBuffer(message)) {
      // Convierte el Buffer a una cadena de texto
      message = message.toString();
      console.log(`Mensaje convertido a texto: ${message}`);
    }
    
    // Asegúrate de que el mensaje sea una cadena de texto
    if (typeof message === 'string') {
      console.log(`Mensaje recibido: ${message}`);
      // Envía el mensaje a todos los clientes conectados
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    } else {
      console.error('Mensaje recibido no es una cadena de texto:', message);
    }
  });

  // Maneja la desconexión de un usuario
  ws.on('close', () => {
    console.log('Un usuario se ha desconectado');
  });
});

// Servir los archivos estáticos (HTML, JS, CSS)
app.use(express.static('public'));



