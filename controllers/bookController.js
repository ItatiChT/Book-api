
const bookModel = require('../models/bookModel');
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

module.exports = { listBooks, getBook, createBook, updateBook, deleteBook };
