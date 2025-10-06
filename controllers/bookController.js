// controllers/bookController.js

import { bookModel } from '../models/bookModel.js';
// La importación de la vista es correcta para la estructura MVC (Consigna 2), 
// aunque la lógica de serialización JSON final está en server.js.
// import { responseView } from '../views/bookView.js'; 

const bookController = {
    // Obtener todos los libros
    getBooks: async () => { // Se hace la función asíncrona para poder esperar la I/O del modelo.
        try {
            // await bookModel.readBooks() espera la lectura asíncrona del archivo JSON.
            const books = await bookModel.readBooks();
            return books; // Devuelve el array de objetos libro.
        } catch (error) {
            // Captura errores del modelo y los propaga al servidor (Consigna 7).
            throw new Error(`Error en el controlador al obtener libros: ${error.message}`);
        }
    },

    // Agregar un libro, generando su ID y persistiendo los datos.
    addBook: async (newBook) => { // Función asíncrona para manejar la lectura y escritura.
        try {
            // 1. Lectura asíncrona de los libros actuales.
            const books = await bookModel.readBooks();
            
            // 2. Lógica para generar el ID secuencial. 
            // NOTA: Recuerda que la Consigna 1 solicita usar 'uuid' para identificadores únicos.
            const newId = books.length > 0 ? Math.max(...books.map(b => Number(b.id))) + 1 : 1;
            
            // 3. Creación del objeto libro con el ID.
            const bookToAdd = { 
                id: newId.toString(), 
                ...newBook 
            };
            
            // 4. Agregar el nuevo libro a la colección.
            books.push(bookToAdd);
            
            // 5. Escritura asíncrona de la lista completa en el archivo.
            await bookModel.writeBooks(books); // Se ajusta el nombre de la función a 'writeBooks'.
            
            // Se retorna el objeto recién creado.
            return bookToAdd; 
        } catch (error) {
            // Manejo de errores (Consigna 7): Propagación de fallos.
            throw new Error(`Error en el controlador al agregar el libro: ${error.message}`);
        }
    },
};

export { bookController };
/*import { bookModel } from '../models/bookModel.js';
import { responseView } from '../views/bookView.js';

const bookController = {
  // Obtener todos los libros
  getBooks: () => {
    const book = bookModel.readBooks();
    return book; // devolvemos los objetos, no string JSON
  },

  // Agregar un libro
  addBook: (newBook) => {   // <-- singular
    const book = bookModel.readBooks();
    const newId = book.length > 0 ? Math.max(...book.map(b => Number(b.id))) + 1 : 1;
    const bookToAdd = { id: newId.toString(), ...newBook };
    book.push(bookToAdd);
    bookModel.writeBook(book);
    return { message: 'Libro agregado con éxito.' }; // devolvemos objeto, no JSON
  },
};

export { bookController };*/
