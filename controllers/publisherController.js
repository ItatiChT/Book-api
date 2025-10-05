//Importamos el modelo y la vista
import { publisherModel } from '../models/publisherModel.js'
import { responseView } from '../views/publisherView.js'

const publisherController = {
    //Obtener todos las editoriales
    getPublishers: () => {
        const publishers = publisherModel.readPublishers(); 
        return responseView.formatResponse(publishers);
    },

    //Método para agregar editorial
    addPublisher: (newPublisher) => {
        const publishers = publisherModel.readPublishers();  
        publishers.push(newPublisher);
        publisherModel.writePublishers(publishers); 
        return responseView.formatResponse({ message: 'Editorial agregada con éxito.' });
    },

    /*//Eliminar editorial por ID
    deletePublisher: (id) => {
        let publishers = publisherModel.readPublishers();
        const newPublishers = publishers.filter(p => p.id !== id);
        if (newPublishers.length === publishers.length) {
            return responseView.formatResponse({ error: 'Editorial no encontrada.' });
        }
        publisherModel.writePublishers(newPublishers);
        return responseView.formatResponse({ message: 'Editorial eliminada con éxito.' });
    }*/
}

export { publisherController }
