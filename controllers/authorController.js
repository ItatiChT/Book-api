// controllers/authorController.js

import { authorModel } from '../models/authorModel.js';

const authorController = {
    /**
     * @description Obtiene todos los autores llamando al modelo de forma asíncrona.
     */
    getAuthors: async () => { // Se hace la función asíncrona para poder esperar la I/O del modelo.
        try {
            // await authorModel.readAuthors() espera la lectura de disco no bloqueante.
            return await authorModel.readAuthors(); 
        } catch (error) {
            // Captura errores del modelo y los propaga al servidor (Consigna 7).
            throw new Error(`Error en el controlador al obtener autores: ${error.message}`);
        }
    },

    /**
     * @description Agrega un nuevo autor, generando su ID secuencial y persistiendo los datos.
     * @param {Object} newAuthor - Los datos del nuevo autor.
     */
    addAuthor: async (newAuthor) => { // Función asíncrona para la lectura y escritura no bloqueante.
        try {
            // 1. Lectura asíncrona de los autores actuales.
            const authors = await authorModel.readAuthors();
            
            // 2. Lógica para generar el ID secuencial: encuentra el máximo y suma 1.
            const newId = authors.length > 0 ? Math.max(...authors.map(a => Number(a.id))) + 1 : 1;
            
            // 3. Creación del objeto autor con el ID.
            const authorToAdd = { 
                id: newId.toString(), 
                ...newAuthor 
            };
            
            // 4. Agregar el nuevo autor a la colección.
            authors.push(authorToAdd);
            
            // 5. Escritura asíncrona de la lista completa en el archivo.
            await authorModel.writeAuthors(authors);
            
            // Retorna el objeto creado para la respuesta al cliente.
            return authorToAdd; 
        } catch (error) {
            // Manejo de errores (Consigna 7): Propagación de fallos.
            throw new Error(`Error en el controlador al agregar el autor: ${error.message}`);
        }
    },
};

export { authorController };
/*import { authorModel } from '../models/authorModel.js';

const authorController = {
  // Obtener todos los autores
  getAuthors: () => {
    return authorModel.readAuthors(); // devuelve array de objetos
  },

  // Agregar un autor
  addAuthor: (newAuthor) => {
    const authors = authorModel.readAuthors();
    const newId = authors.length > 0 ? Math.max(...authors.map(a => Number(a.id))) + 1 : 1;
    const authorToAdd = { id: newId.toString(), ...newAuthor };
    authors.push(authorToAdd);
    authorModel.writeAuthors(authors);
    return { message: 'Autor agregado con éxito.' };
  },
};

export { authorController };*/



/*import { authorModel } from '../models/authorModel.js';
import { responseView } from '../views/authorView.js';

const authorController = {
  getAuthors: () => {
    const authors = authorModel.readAuthors();
    return responseView.formatResponse(authors);
  },

  addAuthors: (newAuthor) => {
    const authors = authorModel.readAuthors();
    const newId = authors.length > 0 ? Math.max(...authors.map(a => Number(a.id))) + 1 : 1;
    const authorToAdd = { id: newId.toString(), ...newAuthor };
    authors.push(authorToAdd);
    authorModel.writeAuthors(authors);
    return responseView.formatResponse({ message: 'Autor agregado con éxito.' });
  },
};

export { authorController };*/
