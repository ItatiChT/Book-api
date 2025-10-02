import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, '../data/authors.json');

const authorModel = {
  //Leemos el archivo JSON y obtenemos los autores
  readAuthors: () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data)
  },
  
  //Escribir el archivo JSON con nueva data
  writeAuthors: (authors) => {
    const jsonData = JSON.stringify(authors, null, 2);
    fs.writeFileSync(filePath, jsonData);
  }
};

export { authorModel };