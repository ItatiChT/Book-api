import net from 'net';
import { bookController } from './controllers/bookController.js';
import { publisherController } from './controllers/publisherController.js'
import { authorController } from './controllers/authorController.js';
import { v4 as uuidv4 } from 'uuid';

function isJSON(str) {
  return str.startsWith('{') && str.endsWith('}');
}

const server = net.createServer((socket) => {
  console.log('Cliente conectado!');

  socket.on('data', (data) => {
    const command = data.toString().trim();

    if (command === 'GET BOOKS') {
      const response = bookController.getBooks();
      socket.write(response);

    } else if (command.startsWith('ADD BOOK')) {
      const bookDataString = command.replace('ADD BOOK', '').trim();

      if (isJSON(bookDataString)) {
        const bookData = JSON.parse(bookDataString);

        if (bookData && typeof bookData === 'object') {
          const newBook = { id: uuidv4(), ...bookData };
          const response = bookController.addBook(newBook);
          socket.write(response);
        } else {
          socket.write('Datos de libro inválidos.');
        }
      } else {
        socket.write('Error: formato JSON no válido.');
      }

    } else if (command === 'GET AUTHORS') {
      const response = authorController.getAuthors
      socket.write(response);

    } else if (command.startsWith('ADD AUTHOR')) {
      const authorDataString = command.replace('ADD AUTHOR', '').trim();

      if (isJSON(authorDataString)) {
        const authorData = JSON.parse(authorDataString);

        if (authorData && typeof authorData === 'object') {
          const newAuthor = { id: uuidv4(), ...authorData };
          const response = authorController.addAuthors(newAuthor)
          socket.write(response);
        } else {
          socket.write('Datos del autor inválidos.');
        }
      } else {
        socket.write('Error: formato JSON no válido.');
      }
      } else if (command === 'GET PUBLISHERS') {
      const response = publisherController.getPublishers()
      socket.write(response);

    } else if (command.startsWith('ADD PUBLISHER')) {
      const publisherDataString = command.replace('ADD PUBLISHER', '').trim();

      if (isJSON(publisherDataString)) {
        const publisherData = JSON.parse(publisherDataString);

        if (publisherData && typeof publisherData === 'object') {
          const newPublisher = { id: uuidv4(), ...publisherData };
          const response = publisherController.addPublisher(newPublisher);
          socket.write(response);
        } else {
          socket.write('Datos de la editorial inválidos.');
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







/*const net = require('net');
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
*/

// agrego el codigo 