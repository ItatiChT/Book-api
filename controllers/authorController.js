//Importamos el modelo y la vista
import { authorModel } from '../models/authorModel.js'
import { responseView } from '../views/authorView.js'

const authorController = {
    //Obtener todos los autores
    getAuthors: () => {
        const authors = authorModel.readAuthors(); //Llamamos a la función readAuthors del modelo
        return responseView.formatResponse(authors) //Llamamos a la función del view
    },

    //Método para agregar autor
    addAuthors: (newAuthor) => {
        const authors = authorModel.readAuthors();  //Se llama a la función para saber qué autores tengo
        author.push(newAuthor);
        authorModel.writeAuthors(); // Llamamos la función writeAuthors del modelo para reescribirlo
        return responseView.formatResponse({message: 'Autor agregado con éxito.'})
    },
/*
    //Eliminar libro por ID
    deleteAuthor: (id) => {
        let authors = authorModel.readAuthors();
        const newAuthors = authors.filter(b => b.id !== id);
        if (newAuthors.length === authors.length) {
            return responseView.formatResponse({ error: 'Autor no encontrado.' });
        }
        authorModel.writeAuthors(newAuthors);
        return responseView.formatResponse({ message: 'Autor eliminado con éxito.' });
    }
*/}

export { authorController }