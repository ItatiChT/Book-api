// controllers/publisherController.js

import { publisherModel } from '../models/publisherModel.js';

const publisherController = {
    // Obtener todas las editoriales
    getPublishers: async () => { // Se hace la función asíncrona para esperar la I/O del modelo.
        try {
            // await publisherModel.readPublishers() espera la lectura no bloqueante del archivo JSON.
            return await publisherModel.readPublishers(); 
        } catch (error) {
            // Captura errores del modelo y los propaga al servidor (Consigna 7).
            throw new Error(`Error en el controlador al obtener editoriales: ${error.message}`);
        }
    },

    // Agregar editorial
    addPublisher: async (newPublisher) => { // Función asíncrona para lectura y escritura no bloqueante.
        try {
            // 1. Lectura asíncrona de las editoriales actuales.
            const publishers = await publisherModel.readPublishers();
            
            // 2. Lógica para generar el ID secuencial, según tu especificación.
            const newId = publishers.length > 0 ? Math.max(...publishers.map(p => Number(p.id))) + 1 : 1;
            
            // 3. Creación del objeto editorial con el ID.
            const publisherToAdd = { 
                id: newId.toString(), 
                ...newPublisher 
            };
            
            // 4. Agregar la nueva editorial a la colección.
            publishers.push(publisherToAdd);
            
            // 5. Escritura asíncrona de la lista completa en el archivo.
            await publisherModel.writePublishers(publishers);
            
            // 6. Retorna el objeto creado, lo cual es más útil para una API que un mensaje estático.
            return publisherToAdd; 
        } catch (error) {
            // Manejo de errores (Consigna 7): Propagación de fallos de I/O o lógica.
            throw new Error(`Error en el controlador al agregar la editorial: ${error.message}`);
        }
    },
};

export { publisherController };

/*import { publisherModel } from '../models/publisherModel.js';

const publisherController = {
  // Obtener todas las editoriales
  getPublishers: () => {
    return publisherModel.readPublishers();
  },

  // Agregar editorial
  addPublisher: (newPublisher) => {
    const publishers = publisherModel.readPublishers();
    const newId = publishers.length > 0 ? Math.max(...publishers.map(p => Number(p.id))) + 1 : 1;
    const publisherToAdd = { id: newId.toString(), ...newPublisher };
    publishers.push(publisherToAdd);
    publisherModel.writePublishers(publishers);
    return { message: 'Editorial agregada con éxito.' };
  },
};

export { publisherController };*/


/*import { publisherModel } from '../models/publisherModel.js';
import { responseView } from '../views/publisherView.js';

const publisherController = {
  getPublishers: () => {
    const publishers = publisherModel.readPublishers();
    return responseView.formatResponse(publishers);
  },

  addPublisher: (newPublisher) => {
    const publishers = publisherModel.readPublishers();
    const newId = publishers.length > 0 ? Math.max(...publishers.map(p => Number(p.id))) + 1 : 1;
    const publisherToAdd = { id: newId.toString(), ...newPublisher };
    publishers.push(publisherToAdd);
    publisherModel.writePublishers(publishers);
    return responseView.formatResponse({ message: 'Editorial agregada con éxito.' });
  },
};

export { publisherController };*/
