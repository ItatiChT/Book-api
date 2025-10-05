import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, '../data/publishers.json');

const publisherModel = {
  //Leemos el archivo JSON y obtenemos las editoriales
  readPublishers: () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data)
  },
  
  //Escribir el archivo JSON con nueva data
  writePublishers: (publishers) => {
    const jsonData = JSON.stringify(publishers, null, 2);
    fs.writeFileSync(filePath, jsonData);
  }
};

export { publisherModel };


