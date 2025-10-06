// client.js

import net from 'net';
import readline from 'readline';

const PORT = 8080;
const HOST = 'localhost';

// Creamos la interfaz de lectura desde la consola
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función auxiliar para preguntar al usuario y devolver una promesa
function askQuestion(prompt) {
    return new Promise(resolve => rl.question(prompt, resolve));
}

// Función para validar si un string es un objeto JSON válido (no un valor primitivo)
function isJSON(str) {
    try {
        const parsed = JSON.parse(str);
        // Validamos que sea un objeto para la entrada de datos (ADD)
        return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
    } catch {
        return false;
    }
}

// Función que se conecta al servidor, envía un comando y devuelve la respuesta
function sendCommand(command) {
    return new Promise((resolve, reject) => {
        const client = net.createConnection({ port: PORT, host: HOST }, () => {
            // Se envía el comando y se añade un salto de línea (\n) para asegurar 
            // que el servidor lo reciba como un mensaje completo.
            client.write(command + '\n'); 
        });

        let dataBuffer = '';
        client.on('data', (data) => {
            // Acumulamos datos en caso de que lleguen fragmentados
            dataBuffer += data.toString(); 
        });

        // Resolvemos la promesa con la data completa cuando el servidor cierra la conexión
        client.on('end', () => resolve(dataBuffer)); 
        
        // Manejo de errores de conexión (Consigna 7)
        client.on('error', (err) => {
            reject(new Error(`Error de conexión con el servidor: ${err.message}`));
        });
    });
}

// Función principal: muestra el menú y gestiona la interacción del usuario
async function mainMenu() {
    console.log('\n--- Biblioteca Virtual API Cliente ---');
    console.log('Comandos disponibles:');
    console.log('1. GET BOOKS');
    console.log('2. ADD BOOK');
    console.log('3. GET AUTHORS');
    console.log('4. ADD AUTHOR');
    console.log('5. GET PUBLISHERS');
    console.log('6. ADD PUBLISHER');
    console.log('0. Salir\n');

    // Mantenemos un bucle para que el cliente no se cierre después de un comando
    while (true) {
        const option = await askQuestion('Ingresa opción (0-6) o comando completo: ');

        try {
            let command = '';
            let skipCommand = false;

            switch(option.trim().toUpperCase()) {
                case '1':
                    command = 'GET BOOKS';
                    break;

                case '2': {
                    const bookJSON = await askQuestion('Ingresa el libro en formato JSON (ej. {"title":"...","authorId":"..."}): ');
                    if (!isJSON(bookJSON)) {
                        console.log('Error: JSON de libro inválido. Intenta de nuevo.');
                        skipCommand = true;
                        break;
                    }
                    command = `ADD BOOK ${bookJSON}`;
                    break;
                }

                case '3':
                    command = 'GET AUTHORS';
                    break;

                case '4': {
                    const authorJSON = await askQuestion('Ingresa el autor en formato JSON (ej. {"name":"..."}): ');
                    if (!isJSON(authorJSON)) {
                        console.log('Error: JSON de autor inválido. Intenta de nuevo.');
                        skipCommand = true;
                        break;
                    }
                    command = `ADD AUTHOR ${authorJSON}`;
                    break;
                }

                case '5':
                    command = 'GET PUBLISHERS';
                    break;

                case '6': {
                    const publisherJSON = await askQuestion('Ingresa la editorial en formato JSON (ej. {"name":"..."}): ');
                    if (!isJSON(publisherJSON)) {
                        console.log('Error: JSON de editorial inválido. Intenta de nuevo.');
                        skipCommand = true;
                        break;
                    }
                    command = `ADD PUBLISHER ${publisherJSON}`;
                    break;
                }

                case '0':
                    console.log('Cerrando cliente. ¡Hasta pronto!');
                    rl.close();
                    return;

                default:
                    // Permite ingresar un comando completo manualmente
                    command = option;
            }

            if (!skipCommand) {
                // Enviamos el comando y esperamos la respuesta del servidor
                const response = await sendCommand(command);
                
                // Mostramos la respuesta del servidor, intentando darle formato JSON si es posible
                try {
                    const parsedResponse = JSON.parse(response.trim());
                    console.log('\n--- Respuesta del Servidor (JSON) ---');
                    console.log(JSON.stringify(parsedResponse, null, 2));
                    console.log('------------------------------------');
                } catch (e) {
                    // Si la respuesta no es JSON, la mostramos como texto
                    console.log('\n--- Respuesta del Servidor (Texto) ---');
                    console.log(response);
                    console.log('------------------------------------');
                }
            }

        } catch (err) {
            // Manejo de errores fatales de conexión
            console.error('\nError fatal:', err.message);
            rl.close();
            return;
        }
    }
}

// Iniciamos el menú principal
mainMenu();
/*import net from 'net';
import readline from 'readline';

const PORT = 8080;
const HOST = 'localhost';

// Creamos la interfaz de lectura desde la consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función auxiliar para preguntar al usuario y devolver una promesa
// Esto permite usar await y mantener el flujo secuencial en el menú
function askQuestion(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

// Función para validar si un string es JSON válido
function isJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

// Función que se conecta al servidor, envía un comando y devuelve la respuesta completa
function sendCommand(command) {
  return new Promise((resolve, reject) => {
    const client = net.createConnection({ port: PORT, host: HOST }, () => {
      client.write(command); // enviamos comando al servidor
    });

    let dataBuffer = '';
    client.on('data', (data) => {
      dataBuffer += data.toString(); // acumulamos datos en caso de que lleguen fragmentados
    });

    client.on('end', () => resolve(dataBuffer)); // resolvemos la promesa cuando el servidor cierra la conexión
    client.on('error', (err) => reject(err));   // manejamos errores de conexión
  });
}

// Función principal: muestra el menú y gestiona la interacción del usuario
async function mainMenu() {
  console.log('\nBienvenido a la Biblioteca Virtual.\n');
  console.log('Comandos disponibles:');
  console.log('1. GET BOOKS');
  console.log('2. ADD BOOK');
  console.log('3. GET AUTHORS');
  console.log('4. ADD AUTHOR');
  console.log('5. GET PUBLISHERS');
  console.log('6. ADD PUBLISHER');
  console.log('0. Salir\n');

  const option = await askQuestion('Ingresa opción (0-6) o comando completo: ');

  try {
    let command = '';

    switch(option.trim()) {
      case '1':
        command = 'GET BOOKS';
        break;

      case '2': {
        const bookJSON = await askQuestion('Ingresa el libro en formato JSON: ');
        if (!isJSON(bookJSON)) {
          console.log('Error: JSON inválido. Usa comillas dobles y formato correcto.');
          return mainMenu();
        }
        command = `ADD BOOK ${bookJSON}`;
        break;
      }

      case '3':
        command = 'GET AUTHORS';
        break;

      case '4': {
        const authorJSON = await askQuestion('Ingresa el autor en formato JSON: ');
        if (!isJSON(authorJSON)) {
          console.log('Error: JSON inválido.');
          return mainMenu();
        }
        command = `ADD AUTHOR ${authorJSON}`;
        break;
      }

      case '5':
        command = 'GET PUBLISHERS';
        break;

      case '6': {
        const publisherJSON = await askQuestion('Ingresa la editorial en formato JSON: ');
        if (!isJSON(publisherJSON)) {
          console.log('Error: JSON inválido.');
          return mainMenu();
        }
        command = `ADD PUBLISHER ${publisherJSON}`;
        break;
      }

      case '0':
        console.log('¡Gracias por usar la Biblioteca Virtual! Vuelva pronto.');
        rl.close();
        return;

      default:
        // Permite ingresar un comando manualmente
        command = option;
    }

    // Enviamos el comando al servidor y mostramos la respuesta
    const response = await sendCommand(command);
    console.log('\nRespuesta del servidor:\n', response);

    // Decisión de diseño:
    // Volvemos automáticamente al menú para que el usuario pueda seguir interactuando
    // sin tener que reiniciar el client cada vez.
    mainMenu();

  } catch (err) {
    console.log('Error en la conexión:', err.message);
    rl.close();
  }
}

// Iniciamos el menú principal
mainMenu();

*/


/*import net from 'net';
import readline from 'readline';

const PORT = 8080;
const HOST = 'localhost';

// Interfaz para leer desde la consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función para validar si un string es JSON
function isJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

// Función para conectarse al servidor y enviar un comando
function sendCommand(command) {
  return new Promise((resolve, reject) => {
    const client = net.createConnection({ port: PORT, host: HOST }, () => {
      client.write(command); // enviamos comando al servidor
    });

    let dataBuffer = '';
    client.on('data', (data) => {
      dataBuffer += data.toString(); // acumulamos datos
    });

    client.on('end', () => resolve(dataBuffer)); // resolvemos al cerrar conexión
    client.on('error', (err) => reject(err)); // manejamos errores
  });
}

// Función principal: menú interactivo
async function mainMenu() {
  console.log('\nBienvenido a la Biblioteca Virtual.\n');
  console.log('Comandos disponibles:');
  console.log('1. GET BOOKS');
  console.log('2. ADD BOOK');
  console.log('3. GET AUTHORS');
  console.log('4. ADD AUTHOR');
  console.log('5. GET PUBLISHERS');
  console.log('6. ADD PUBLISHER');
  console.log('0. Salir\n');

  rl.question('Ingresa opción (0-6) o comando completo: ', async (option) => {
    try {
      let command = '';

      switch(option.trim()) {
        case '1':
          command = 'GET BOOKS';
          break;

        case '2':
          rl.question('Ingresa el libro en formato JSON: ', async (bookJSON) => {
            if (!isJSON(bookJSON)) {
              console.log('Error: JSON inválido.');
              return mainMenu(); // volvemos al menú
            }
            command = `ADD BOOK ${bookJSON}`;
            const response = await sendCommand(command);
            console.log('\nRespuesta del servidor:\n', response);
            return mainMenu();
          });
          return;

        case '3':
          command = 'GET AUTHORS';
          break;

        case '4':
          rl.question('Ingresa el autor en formato JSON: ', async (authorJSON) => {
            if (!isJSON(authorJSON)) {
              console.log('Error: JSON inválido.');
              return mainMenu();
            }
            command = `ADD AUTHOR ${authorJSON}`;
            const response = await sendCommand(command);
            console.log('\nRespuesta del servidor:\n', response);
            return mainMenu();
          });
          return;

        case '5':
          command = 'GET PUBLISHERS';
          break;

        case '6':
          rl.question('Ingresa la editorial en formato JSON: ', async (publisherJSON) => {
            if (!isJSON(publisherJSON)) {
              console.log('Error: JSON inválido.');
              return mainMenu();
            }
            command = `ADD PUBLISHER ${publisherJSON}`;
            const response = await sendCommand(command);
            console.log('\nRespuesta del servidor:\n', response);
            return mainMenu();
          });
          return;

        case '0':
          console.log('¡Gracias por usar la Biblioteca Virtual! Vuelva pronto.');
          rl.close();
          return;

        default:
          // Permite ingresar un comando completo manualmente
          command = option;
      }

      // Para los GET u otros comandos directos
      const response = await sendCommand(command);
      console.log('\nRespuesta del servidor:\n', response);

      // Decisión: volver automáticamente al menú para interacción continua
      mainMenu();

    } catch (err) {
      console.log('Error en la conexión:', err.message);
      rl.close();
    }
  });
}

// Iniciamos el menú principal
mainMenu();*/
