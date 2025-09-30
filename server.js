
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
