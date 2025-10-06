// models/bookModel.js

// Importamos 'fs/promises' para usar la API asíncrona. 
// Es esencial que las operaciones de I/O (lectura/escritura) sean no bloqueantes para el servidor TCP.
import fs from 'fs/promises'; 
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Configuramos __dirname para entornos ESModules, asegurando que la ruta funcione correctamente.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta al archivo JSON de libros (Consigna 3: Manejo de Datos)
const filePath = path.join(__dirname, '../data/books.json');

const bookModel = {
    // Leer todos los libros del archivo JSON de forma asíncrona
    readBooks: async () => { // Hacemos la función 'async' para no bloquear el Event Loop.
        try {
            // await fs.readFile realiza la lectura sin bloquear el servidor.
            const data = await fs.readFile(filePath, 'utf8'); 
            return JSON.parse(data); // Convertimos a array de objetos
        } catch (err) {
            // Manejo de errores (Consigna 7): Si el archivo no existe (ENOENT), 
            // devolvemos un array vacío. Esto es mejor que fallar.
            if (err.code === 'ENOENT') {
                return []; 
            }
            // Para cualquier otro error (ej. JSON mal formado), lanzamos una excepción.
            console.error('Error al leer books.json:', err.message);
            throw new Error('No se pudo leer o parsear books.json.');
        }
    },

    // Escribir un array de libros en el archivo JSON de forma asíncrona
    writeBooks: async (books) => { // Hacemos la función 'async' para la operación no bloqueante.
        try {
            // Stringify con indentación (2) para mantener el archivo JSON legible.
            const jsonData = JSON.stringify(books, null, 2); 
            // await fs.writeFile guarda los datos de forma no bloqueante.
            await fs.writeFile(filePath, jsonData, 'utf8'); 
        } catch (err) {
            // Manejo de errores de escritura (Consigna 7).
            console.error('Error al escribir books.json:', err.message);
            throw new Error('No se pudo escribir en books.json.');
        }
    }
};

export { bookModel };

/*import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Configuramos __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta al archivo JSON de libros
const filePath = path.join(__dirname, '../data/books.json');

const bookModel = {
  // Leer todos los libros del archivo JSON
  readBooks: () => {
    try {
      const data = fs.readFileSync(filePath, 'utf8'); // Leemos como texto
      return JSON.parse(data); // Convertimos a array de objetos
    } catch (err) {
      // Lanzamos error para que el controlador maneje el mensaje
      throw new Error('No se pudo leer books.json: ' + err.message);
    }
  },

  // Escribir un array de libros en el archivo JSON
  writeBooks: (books) => {
    try {
      const jsonData = JSON.stringify(books, null, 2); // Texto JSON legible
      fs.writeFileSync(filePath, jsonData, 'utf8'); // Sobrescribimos archivo
    } catch (err) {
      // Lanzamos error para que el controlador maneje el mensaje
      throw new Error('No se pudo escribir books.json: ' + err.message);
    }
  }
};

export { bookModel };*/
