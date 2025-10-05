import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { bookModel } from '../models/bookModel.js';
import { responseView } from '../views/bookView.js'



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataPath = path.join(__dirname, '../data/books.json');

const bookController = {
    //Obtener todos los libros
    getBooks: () => {
        const books = bookModel.readBooks(); //Llamamos a la función readbooks del modelo
        return responseView.formatResponse(books) //Llamamos a la función del view
    },
  
    //Agregar libros
    addBooks: (newBook) => {
    const books = bookModel.readBooks();  // Leo los libros existentes
    books.push(newBook);                  // Agrego el nuevo libro
    bookModel.writeBooks(books);          // Escribo el array completo actualizado
    return responseView.formatResponse({ message: 'Libro agregado con éxito.' });
},
/*
    //Buscar libro por ID
    getBookById: (id) => {
        const books = bookModel.readBooks();
        const book = books.find(b => b.id === id);
        if (!book) {
            return responseView.formatResponse({ error: 'Libro no encontrado.' });
        }
        return responseView.formatResponse(book);
    },

    //Actualizar libro por ID
    updateBook: (id, updatedData) => {
        const books = bookModel.readBooks();
        const index = books.findIndex(b => b.id === id);
        if (index === -1) {
            return responseView.formatResponse({ error: 'Libro no encontrado.' });
        }
        books[index] = { ...books[index], ...updatedData }; // fusiona lo existente con lo nuevo
        bookModel.writeBooks(books);
        return responseView.formatResponse({ message: 'Libro actualizado con éxito.' });
    },

    //Eliminar libro por ID
    deleteBook: (id) => {
        let books = bookModel.readBooks();
        const newBooks = books.filter(b => b.id !== id);
        if (newBooks.length === books.length) {
            return responseView.formatResponse({ error: 'Libro no encontrado.' });
        }
        bookModel.writeBooks(newBooks);
        return responseView.formatResponse({ message: 'Libro eliminado con éxito.' });
    }
*/};

export { bookController }


/*const bookModel = require('../models/bookModel');
const view = require('../views/bookView');

function listBooks() {
  const books = bookModel.getAll();
  return view.renderList(books);
}

function getBook(id) {
  const book = bookModel.getById(id);
  return view.renderDetail(book);
}

function createBook(data) {
  const newBook = bookModel.create(data);
  return view.renderDetail(newBook);
}

function updateBook(id, data) {
  const updatedBook = bookModel.update(id, data);
  return view.renderDetail(updatedBook);
}

function deleteBook(id) {
  bookModel.remove(id);
  return view.renderMessage(`Libro ${id} eliminado correctamente`);
}

module.exports = { listBooks, getBook, createBook, updateBook, deleteBook };*/
