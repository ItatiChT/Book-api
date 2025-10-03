
const net = require('net');
const bookController = require('./controllers/bookController');

const PORT = 4000;

const server = net.createServer((socket) => {
  console.log('Cliente conectado');
  socket.setEncoding('utf8');

  socket.on('data', (raw) => {
    try {
      const req = JSON.parse(raw.trim());
      let res;
      switch (req.action) {
        case 'list':
          res = bookController.listBooks();
          break;
        case 'get':
          res = bookController.getBook(req.id);
          break;
        case 'create':
          res = bookController.createBook(req.data);
          break;
        case 'update':
          res = bookController.updateBook(req.id, req.data);
          break;
        case 'delete':
          res = bookController.deleteBook(req.id);
          break;
        default:
          res = { status: 'error', message: 'Acción desconocida' };
      }
      socket.write(JSON.stringify(res) + '\n');
    } catch (err) {
      socket.write(JSON.stringify({ status: 'error', message: err.message }) + '\n');
    }
  });

  socket.on('end', () => console.log('Cliente desconectado'));
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});


// agrego el codigo 

import net from 'net';
import { bookController } from './controllers/bookController.js';
import { v4 as uuidv4 } from 'uuid';

function isJSON(str) {
  return str.startsWith('{') && str.endsWith('}');
}

const server = net.createServer((socket) => {
  console.log('Cliente conectado!');

  socket.on('data', (data) => {
    const command = data.toString().trim();

    if (command === 'LIST BOOKS') {
      const response = bookController.listBooks();
      socket.write(response);

    } else if (command.startsWith('ADD BOOK ')) {
      const bookDataString = command.replace('ADD BOOK ', '').trim();

      if (isJSON(bookDataString)) {
        const bookData = JSON.parse(bookDataString);

        if (bookData && typeof bookData === 'object') {
          const newBook = { id: uuidv4(), ...bookData };
          const response = bookController.createBook(newBook);
          socket.write(response);
        } else {
          socket.write('Datos de libro inválidos.');
        }
      } else {
        socket.write('Error: formato JSON no válido.');
      }

    } else {
      socket.write('Comando no reconocido.');
    }
  });

  socket.on('end', () => console.log('Cliente se ha desconectado'));
});

server.listen(4000, () => {
  console.log('Servidor escuchando en el puerto 4000');
});