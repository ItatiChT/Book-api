
//Importamos los módulos necesarios
/*const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');*/

import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, '../data/books.json');

const bookModel = {
  //Leemos el archivo JSON y obtenemos los libros
  readBooks: () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data)
  },
  
  //Escribir el archivo JSON con nueva data
  writeBooks: (books) => {
    const jsonData = JSON.stringify(books, null, 2);
    fs.writeFileSync(filePath, jsonData);
  }
};

export { bookModel };

/*
function loadBooks() {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify([]));
  }
  const raw = fs.readFileSync(dataPath);
  return JSON.parse(raw);
}

function saveBooks(books) {
  fs.writeFileSync(dataPath, JSON.stringify(books, null, 2));
}

function getAll() {
  return loadBooks();
}

function getById(id) {
  return loadBooks().find(book => book.id === id);
}

function create(book) {
  const books = loadBooks();
  const newBook = { id: uuidv4(), ...book };
  books.push(newBook);
  saveBooks(books);
  return newBook;
}

function update(id, updatedFields) {
  const books = loadBooks();
  const index = books.findIndex(book => book.id === id);
  if (index === -1) return null;
  books[index] = { ...books[index], ...updatedFields };
  saveBooks(books);
  return books[index];
}

function remove(id) {
  let books = loadBooks();
  books = books.filter(book => book.id !== id);
  saveBooks(books);
  return true;
}

module.exports = { getAll, getById, create, update, remove };*/
