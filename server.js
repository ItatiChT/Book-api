// server.js

import net from 'net';
// Importamos los controladores que contienen la lógica de negocio y llaman a los modelos
import { bookController } from './controllers/bookController.js';
import { authorController } from './controllers/authorController.js';
import { publisherController } from './controllers/publisherController.js';

const PORT = 8080;

/**
 * Función central para procesar todos los comandos del cliente.
 * Es ASÍNCRONA para manejar las llamadas a los controladores y modelos no bloqueantes.
 * @param {string} commandString - El string de comando completo recibido.
 * @returns {Promise<string>} - Una promesa que resuelve con la respuesta JSON formateada.
 */
async function handleCommand(commandString) {
    // Limpiamos y dividimos el comando.
    const parts = commandString.trim().toUpperCase().split(/\s+/); 
    const action = parts[0]; // GET, ADD
    const resource = parts[1]; // BOOKS, AUTHOR, PUBLISHER
    
    // Extraer el payload JSON. Usa regex para evitar problemas si el JSON tiene espacios.
    const actionResourceRegex = new RegExp(`^${action}\\s+${resource}\\s*`, 'i');
    let payloadString = commandString.replace(actionResourceRegex, '').trim();

    let result = { status: 'ERROR', message: 'Comando no procesado.' };
    
    try {
        switch (action) {
            case 'GET':
                switch (resource) {
                    case 'BOOKS':
                        result.data = await bookController.getBooks(); 
                        result.status = 'OK';
                        break;
                    case 'AUTHORS':
                        result.data = await authorController.getAuthors(); 
                        result.status = 'OK';
                        break;
                    case 'PUBLISHERS':
                        result.data = await publisherController.getPublishers(); 
                        result.status = 'OK';
                        break;
                    default:
                        throw new Error(`Recurso desconocido para GET: ${resource}`);
                }
                break;

            case 'ADD':
                let data;
                try {
                    data = JSON.parse(payloadString);
                    if (typeof data !== 'object' || data === null) {
                        throw new Error('El payload no es un objeto JSON válido.');
                    }
                } catch (e) {
                    throw new Error('El payload debe ser un objeto JSON válido.');
                }
                
                switch (resource) {
                    case 'BOOK':
                        result.data = await bookController.addBook(data); 
                        result.status = 'CREATED';
                        break;
                    case 'AUTHOR':
                        result.data = await authorController.addAuthor(data); 
                        result.status = 'CREATED';
                        break;
                    case 'PUBLISHER':
                        result.data = await publisherController.addPublisher(data); 
                        result.status = 'CREATED';
                        break;
                    default:
                        throw new Error(`Recurso desconocido para ADD: ${resource}`);
                }
                break;

            default:
                throw new Error(`Comando principal no reconocido: ${action}. Comandos válidos: GET, ADD.`);
        }
        
        // Devolvemos el JSON de resultado exitoso.
        return JSON.stringify(result, null, 2);

    } catch (error) {
        console.error(`Error procesando comando "${commandString}": ${error.message}`);
        return JSON.stringify({ 
            status: 'SERVER_ERROR', 
            message: error.message || 'Error interno del servidor al procesar la solicitud.' 
        }, null, 2);
    }
}

// Implementación del servidor TCP (Consigna 4)
const server = net.createServer((socket) => {
    console.log('Cliente conectado!');

    // Evento de recepción de datos (comandos)
    socket.on('data', async (data) => { 
        const commandString = data.toString().trim();
        console.log(`Comando recibido: "${commandString}"`);

        // Procesar el comando y obtener la respuesta
        const response = await handleCommand(commandString);
        
        // 1. Enviar la respuesta al cliente.
        socket.write(response + '\n'); 
        
        // 2. CIERRE OBLIGATORIO DE LA CONEXIÓN: 
        // Esto es lo que permite que el cliente (client.js) resuelva su promesa y muestre la respuesta.
        socket.end(); 
    });

    // Manejo de eventos de conexión y errores de socket
    socket.on('end', () => console.log('Cliente se ha desconectado'));
    
    socket.on('error', (err) => {
        console.error(`Error de conexión (socket): ${err.message}`);
    });
});

// Inicia el servidor
server.listen(PORT, () => {
    console.log(`Servidor TCP escuchando en el puerto ${PORT}`);
});

// Manejo de errores del servidor principal
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Error fatal: El puerto ${PORT} ya está en uso.`);
    } else {
        console.error('Error fatal del servidor:', err);
    }
});


/*// server.js

import net from 'net';
import { bookController } from './controllers/bookController.js';
import { authorController } from './controllers/authorController.js';
import { publisherController } from './controllers/publisherController.js';

const PORT = 8080;

/**
 * Función central para procesar todos los comandos del cliente.
 * Es ASÍNCRONA para manejar las llamadas a los controladores y modelos no bloqueantes.
 * @param {string} commandString - El string de comando completo recibido.
 * @returns {Promise<string>} - Una promesa que resuelve con la respuesta JSON formateada.
 
async function handleCommand(commandString) {
    // Limpiamos y dividimos el comando.
    const parts = commandString.trim().toUpperCase().split(/\s+/); 
    const action = parts[0]; // GET, ADD
    const resource = parts[1]; // BOOKS, AUTHOR, PUBLISHER
    
    // El payload (datos JSON) es el resto del string después de 'ACTION RESOURCE'
    // Se usa una expresión regular para encontrar el inicio exacto del payload
    const actionResourceRegex = new RegExp(`^${action}\\s+${resource}\\s*`, 'i');
    let payloadString = commandString.replace(actionResourceRegex, '').trim();

    // Objeto que almacenará la respuesta, por defecto en estado de error.
    let result = { status: 'ERROR', message: 'Comando no procesado.' };
    
    try {
        switch (action) {
            case 'GET':
                // Manejo de comandos GET (Lectura - Consigna 4 y 6)
                switch (resource) {
                    case 'BOOKS':
                        result.data = await bookController.getBooks(); // Llamada ASÍNCRONA
                        result.status = 'OK';
                        break;
                    case 'AUTHORS':
                        result.data = await authorController.getAuthors(); // Llamada ASÍNCRONA
                        result.status = 'OK';
                        break;
                    case 'PUBLISHERS':
                        result.data = await publisherController.getPublishers(); // Llamada ASÍNCRONA
                        result.status = 'OK';
                        break;
                    default:
                        // Comando GET desconocido (Consigna 7)
                        throw new Error(`Recurso desconocido para GET: ${resource}`);
                }
                break;

            case 'ADD':
                // Manejo de comandos ADD (Escritura - Consigna 4 y 6)
                let data;
                try {
                    // Intenta parsear el payload. Si falla, lanza un error de JSON mal formado (Consigna 7).
                    data = JSON.parse(payloadString);
                    if (typeof data !== 'object' || data === null) {
                        throw new Error('El payload no es un objeto JSON válido.');
                    }
                } catch (e) {
                    throw new Error('El payload debe ser un objeto JSON válido.');
                }
                
                switch (resource) {
                    case 'BOOK':
                        result.data = await bookController.addBook(data); // Llamada ASÍNCRONA
                        result.status = 'CREATED';
                        break;
                    case 'AUTHOR':
                        result.data = await authorController.addAuthor(data); // Llamada ASÍNCRONA
                        result.status = 'CREATED';
                        break;
                    case 'PUBLISHER':
                        result.data = await publisherController.addPublisher(data); // Llamada ASÍNCRONA
                        result.status = 'CREATED';
                        break;
                    default:
                        throw new Error(`Recurso desconocido para ADD: ${resource}`);
                }
                break;

            default:
                // Comando principal no implementado (Consigna 7)
                throw new Error(`Comando principal no reconocido: ${action}. Comandos válidos: GET, ADD.`);
        }
        
        // Si no hubo errores, se devuelve el JSON de resultado exitoso.
        return JSON.stringify(result, null, 2);

    } catch (error) {
        // Captura y manejo de errores (Consigna 7): Del servidor, del modelo o de JSON mal formado.
        console.error(`Error procesando comando "${commandString}": ${error.message}`);
        return JSON.stringify({ 
            status: 'SERVER_ERROR', 
            message: error.message || 'Error interno del servidor al procesar la solicitud.' 
        }, null, 2);
    }
}

// Implementación del servidor TCP (Consigna 4)
const server = net.createServer((socket) => {
    console.log('Cliente conectado!');

    // Evento de recepción de datos (comandos)
    // El listener debe ser ASÍNCRONO para poder usar 'await' en handleCommand (Consigna 4).
    socket.on('data', async (data) => { 
        const commandString = data.toString().trim();
        console.log(`Comando recibido: "${commandString}"`);

        // Procesar el comando y obtener la respuesta
        const response = await handleCommand(commandString);
        
        // Enviar la respuesta al cliente. Se agrega '\n' para delimitar la respuesta en el cliente.
        socket.write(response + '\n'); 
    });

    // Manejo de eventos de conexión y errores de socket (Consigna 7)
    socket.on('end', () => console.log('Cliente se ha desconectado'));
    
    socket.on('error', (err) => {
        // Manejo de errores de socket (p. ej., cliente cierra la conexión bruscamente)
        console.error(`Error de conexión (socket): ${err.message}`);
    });
});

// Inicia el servidor
server.listen(PORT, () => {
    console.log(`Servidor TCP escuchando en el puerto ${PORT}`);
});

// Manejo de errores del servidor principal (Consigna 7)
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Error fatal: El puerto ${PORT} ya está en uso.`);
    } else {
        console.error('Error fatal del servidor:', err);
    }
});

/*import net from 'net';
import { bookController } from './controllers/bookController.js';
import { authorController } from './controllers/authorController.js';
import { publisherController } from './controllers/publisherController.js';

// Función para validar si un string es JSON simple
function isJSON(str) {
  return str.startsWith('{') && str.endsWith('}');
}

// Función para generar ID numérico secuencial
function getNextId(items) {
  if (!items.length) return 1;
  return Math.max(...items.map(item => Number(item.id))) + 1;
}

const PORT = 8080;

const server = net.createServer((socket) => {
  console.log('Cliente conectado!');

  socket.on('data', (data) => {
    const command = data.toString().trim();

    // ====== LIBROS ======
    if (command === 'GET BOOKS') {
      try {
        const books = bookController.getBooks();
        socket.write(JSON.stringify(books, null, 2));
      } catch (err) {
        socket.write('Error al obtener libros: ' + err.message);
      }

    } else if (command.startsWith('ADD BOOK')) {
      const bookDataString = command.replace('ADD BOOK', '').trim();

      if (!isJSON(bookDataString)) {
        socket.write('Error: JSON mal formado.');
        return;
      }

      const bookData = JSON.parse(bookDataString);
      if (bookData && typeof bookData === 'object') {
        try {
          const response = bookController.addBook(bookData);
          socket.write(JSON.stringify(response, null, 2));
        } catch (err) {
          socket.write('Error al agregar el libro: ' + err.message);
        }
      } else {
        socket.write('Datos de libro inválidos.');
      }

    // ====== AUTORES ======
    } else if (command === 'GET AUTHORS') {
      try {
        const authors = authorController.getAuthors();
        socket.write(JSON.stringify(authors, null, 2)); // <-- formato bonito
      } catch (err) {
        socket.write('Error al obtener autores: ' + err.message);
      }

    } else if (command.startsWith('ADD AUTHOR')) {
      const authorDataString = command.replace('ADD AUTHOR', '').trim();

      if (!isJSON(authorDataString)) {
        socket.write('Error: JSON mal formado.');
        return;
      }

      const authorData = JSON.parse(authorDataString);
      if (authorData && typeof authorData === 'object') {
        try {
          const response = authorController.addAuthor(authorData); // <-- singular
          socket.write(JSON.stringify(response, null, 2));
        } catch (err) {
          socket.write('Error al agregar el autor: ' + err.message);
        }
      } else {
        socket.write('Datos del autor inválidos.');
      }

    // ====== EDITORIALES ======
    } else if (command === 'GET PUBLISHERS') {
      try {
        const publishers = publisherController.getPublishers();
        socket.write(JSON.stringify(publishers, null, 2)); // <-- formato bonito
      } catch (err) {
        socket.write('Error al obtener editoriales: ' + err.message);
      }

    } else if (command.startsWith('ADD PUBLISHER')) {
      const publisherDataString = command.replace('ADD PUBLISHER', '').trim();

      if (!isJSON(publisherDataString)) {
        socket.write('Error: JSON mal formado.');
        return;
      }

      const publisherData = JSON.parse(publisherDataString);
      if (publisherData && typeof publisherData === 'object') {
        try {
          const response = publisherController.addPublisher(publisherData);
          socket.write(JSON.stringify(response, null, 2));
        } catch (err) {
          socket.write('Error al agregar la editorial: ' + err.message);
        }
      } else {
        socket.write('Datos de la editorial inválidos.');
      }

    // ====== COMANDO NO RECONOCIDO ======
    } else {
      socket.write(
        'Comando no reconocido. Comandos válidos: GET BOOKS, ADD BOOK, GET AUTHORS, ADD AUTHOR, GET PUBLISHERS, ADD PUBLISHER.'
      );
    }
  });

  socket.on('end', () => console.log('Cliente se ha desconectado'));
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
*/


/*import net from 'net';
import { bookController } from './controllers/bookController.js';
import { authorController } from './controllers/authorController.js';
import { publisherController } from './controllers/publisherController.js';

// Función para validar si un string es JSON simple
function isJSON(str) {
  return str.startsWith('{') && str.endsWith('}');
}

// Función para generar ID numérico secuencial
function getNextId(items) {
  if (!items.length) return 1;
  return Math.max(...items.map(item => Number(item.id))) + 1;
}

const PORT = 8080;

const server = net.createServer((socket) => {
  console.log('Cliente conectado!');

  // Evento cuando el cliente envía datos
  socket.on('data', (data) => {
    const command = data.toString().trim();

    // ====== LIBROS ======
    if (command === 'GET BOOKS') {
      try {
        const books = bookController.getBooks(); // devuelve array de objetos
        socket.write(JSON.stringify(books, null, 2)); // enviamos JSON bonito
      } catch (err) {
        socket.write('Error al obtener libros: ' + err.message);
      }

    } else if (command.startsWith('ADD BOOK')) {
      const bookDataString = command.replace('ADD BOOK', '').trim();

      if (!isJSON(bookDataString)) {
        socket.write('Error: JSON mal formado.');
        return;
      }

      const bookData = JSON.parse(bookDataString);
      if (bookData && typeof bookData === 'object') {
        try {
          const response = bookController.addBook(bookData); // singular
          socket.write(JSON.stringify(response, null, 2));
        } catch (err) {
          socket.write('Error al agregar el libro: ' + err.message);
        }
      } else {
        socket.write('Datos de libro inválidos.');
      }

    // ====== AUTORES ======
    } else if (command === 'GET AUTHORS') {
      try {
        const authors = authorController.getAuthors();
        socket.write(JSON.stringify(authors, null, 2));
      } catch (err) {
        socket.write('Error al obtener autores: ' + err.message);
      }

    } else if (command.startsWith('ADD AUTHOR')) {
      const authorDataString = command.replace('ADD AUTHOR', '').trim();

      if (!isJSON(authorDataString)) {
        socket.write('Error: JSON mal formado.');
        return;
      }

      const authorData = JSON.parse(authorDataString);
      if (authorData && typeof authorData === 'object') {
        try {
          const response = authorController.addAuthor(authorData); // singular
          socket.write(JSON.stringify(response, null, 2));
        } catch (err) {
          socket.write('Error al agregar el autor: ' + err.message);
        }
      } else {
        socket.write('Datos del autor inválidos.');
      }

    // ====== EDITORIALES ======
    } else if (command === 'GET PUBLISHERS') {
      try {
        const publishers = publisherController.getPublishers();
        socket.write(JSON.stringify(publishers, null, 2));
      } catch (err) {
        socket.write('Error al obtener editoriales: ' + err.message);
      }

    } else if (command.startsWith('ADD PUBLISHER')) {
      const publisherDataString = command.replace('ADD PUBLISHER', '').trim();

      if (!isJSON(publisherDataString)) {
        socket.write('Error: JSON mal formado.');
        return;
      }

      const publisherData = JSON.parse(publisherDataString);
      if (publisherData && typeof publisherData === 'object') {
        try {
          const response = publisherController.addPublisher(publisherData); // singular
          socket.write(JSON.stringify(response, null, 2));
        } catch (err) {
          socket.write('Error al agregar la editorial: ' + err.message);
        }
      } else {
        socket.write('Datos de la editorial inválidos.');
      }

    // ====== COMANDO NO RECONOCIDO ======
    } else {
      socket.write(
        'Comando no reconocido. Comandos válidos: GET BOOKS, ADD BOOK, GET AUTHORS, ADD AUTHOR, GET PUBLISHERS, ADD PUBLISHER.'
      );
    }
  });

  // Evento cuando el cliente se desconecta
  socket.on('end', () => console.log('Cliente se ha desconectado'));
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});*/
