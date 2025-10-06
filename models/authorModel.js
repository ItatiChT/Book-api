/*import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Configuramos __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta al archivo JSON de autores
const filePath = path.join(__dirname, '../data/authors.json');

const authorModel = {
  // Leer todos los autores del archivo JSON
  readAuthors: () => {
    try {
      const data = fs.readFileSync(filePath, 'utf8'); // Leemos como texto
      return JSON.parse(data); // Convertimos a array de objetos
    } catch (err) {
      // Lanzamos error para que el controlador maneje el mensaje
      throw new Error('No se pudo leer authors.json: ' + err.message);
    }
  },

  // Escribir un array de autores en el archivo JSON
  writeAuthors: (authors) => {
    try {
      const jsonData = JSON.stringify(authors, null, 2); // Texto JSON legible
      fs.writeFileSync(filePath, jsonData, 'utf8'); // Sobrescribimos archivo
    } catch (err) {
      // Lanzamos error para que el controlador maneje el mensaje
      throw new Error('No se pudo escribir authors.json: ' + err.message);
    }
  }
};

export { authorModel };
// models/authorModel.js */

// Importamos 'fs/promises' para usar la API asíncrona. 
// Es vital para que el servidor TCP (Consigna 4) no se bloquee al leer/escribir.
import fs from 'fs/promises'; 
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Configuramos __dirname para entornos ESModules.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta al archivo JSON de autores (Consigna 3)
const filePath = path.join(__dirname, '../data/authors.json');

const authorModel = {
    /**
     * @description Lee y parsea todos los autores del archivo JSON de forma asíncrona.
     */
    readAuthors: async () => { // Función asíncrona para operaciones no bloqueantes.
        try {
            // await fs.readFile: Lectura asíncrona.
            const data = await fs.readFile(filePath, 'utf8'); 
            return JSON.parse(data); // Convertimos el texto a array de objetos.
        } catch (err) {
            // Manejo de errores (Consigna 7): Si el archivo no existe (ENOENT), 
            // devolvemos un array vacío.
            if (err.code === 'ENOENT') {
                return []; 
            }
            // Para otros errores, registramos y relanzamos.
            console.error('Error al leer authors.json:', err.message);
            throw new Error('No se pudo leer o parsear authors.json.');
        }
    },

    /**
     * @description Escribe un array de autores en el archivo JSON de forma asíncrona.
     * @param {Array<Object>} authors - Array de objetos autores a guardar.
     */
    writeAuthors: async (authors) => { // Función asíncrona.
        try {
            // Stringify con formato legible.
            const jsonData = JSON.stringify(authors, null, 2); 
            // await fs.writeFile: Escritura asíncrona y no bloqueante.
            await fs.writeFile(filePath, jsonData, 'utf8'); 
        } catch (err) {
            // Manejo de errores de escritura (Consigna 7).
            console.error('Error al escribir authors.json:', err.message);
            throw new Error('No se pudo escribir en authors.json.');
        }
    }
};

export { authorModel };