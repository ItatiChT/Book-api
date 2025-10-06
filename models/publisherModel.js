// models/publisherModel.js

// Importamos 'fs/promises' para garantizar operaciones de I/O no bloqueantes.
// Esto es fundamental para la eficiencia del servidor TCP (Consigna 4).
import fs from 'fs/promises'; 
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Configuramos __dirname para entornos ESModules.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta al archivo JSON de editoriales (Consigna 3: Datos)
const filePath = path.join(__dirname, '../data/publishers.json');

const publisherModel = {
    // Leer todas las editoriales del archivo JSON de forma asíncrona
    readPublishers: async () => { // Hacemos la función 'async' para usar await.
        try {
            // await fs.readFile: Lectura asíncrona, no bloquea el Event Loop.
            const data = await fs.readFile(filePath, 'utf8'); 
            return JSON.parse(data); // Convertimos el texto a array de objetos.
        } catch (err) {
            // Manejo de errores (Consigna 7): Si el archivo no existe (ENOENT), 
            // devolvemos un array vacío.
            if (err.code === 'ENOENT') {
                return []; 
            }
            // Para otros errores, lanzamos la excepción.
            console.error('Error al leer publishers.json:', err.message);
            throw new Error('No se pudo leer o parsear publishers.json.');
        }
    },

    // Escribir un array de editoriales en el archivo JSON de forma asíncrona
    writePublishers: async (publishers) => { // Hacemos la función 'async'.
        try {
            // Stringify con formato legible.
            const jsonData = JSON.stringify(publishers, null, 2); 
            // await fs.writeFile: Escritura asíncrona y no bloqueante.
            await fs.writeFile(filePath, jsonData, 'utf8'); 
        } catch (err) {
            // Manejo de errores de escritura (Consigna 7).
            console.error('Error al escribir publishers.json:', err.message);
            throw new Error('No se pudo escribir en publishers.json.');
        }
    }
};

export { publisherModel };

/*import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Configuramos __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta al archivo JSON de editoriales
const filePath = path.join(__dirname, '../data/publishers.json');

const publisherModel = {
  // Leer todas las editoriales del archivo JSON
  readPublishers: () => {
    try {
      const data = fs.readFileSync(filePath, 'utf8'); // Leemos como texto
      return JSON.parse(data); // Convertimos a array de objetos
    } catch (err) {
      // Lanzamos error para que el controlador maneje el mensaje
      throw new Error('No se pudo leer publishers.json: ' + err.message);
    }
  },

  // Escribir un array de editoriales en el archivo JSON
  writePublishers: (publishers) => {
    try {
      const jsonData = JSON.stringify(publishers, null, 2); // JSON legible
      fs.writeFileSync(filePath, jsonData, 'utf8'); // Sobrescribimos archivo
    } catch (err) {
      // Lanzamos error para que el controlador maneje el mensaje
      throw new Error('No se pudo escribir publishers.json: ' + err.message);
    }
  }
};

export { publisherModel };
*/