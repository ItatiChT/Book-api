import net from 'net';
import readline from 'readline'

//Creación de la interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

//Creación del cliente
const client = new net.Socket();

//Establecemos la conexión con el servidor
client.connect(4000, 'localHost', () => {
    console.log('Conectados al servidor TCP.').
    rl.question('Escribe un comando. \n GET BOOKS\n ADD BOOK {}\n GET AUTHORS\n ADD AUTHOR {}\n GET PUBLISHERS\n ADD PUBLISHER {}', (command) =>{
        client.write(command); //Le enviamos el comando al servidor
    });
})

//Manejo de la respuesta del servidor
client.on('data', (data) => {
    console.log('Respuesta del servidor:', data.toString());

    rl.close();

    client.destroy()
});

//manejo del evento close
client.on('close', () => {
    console.log('Conexión cerrada con el servidor')
})



/*
const client = net.createConnection({ port: 8080 }, () => {
    console.log('Conectado al servidor TCP');

    
    client.write('GET BOOKS');

    
    const newBook = JSON.stringify({
        title: 'El Principito',
        author: 'Antoine de Saint-Exupéry',
        publisher: 'Reynal & Hitchcock',
        year: 1943
    });
    client.write(`ADD BOOK ${newBook}`);
});
client.on('end', () => console.log('Desconectado del servidor.'));
client.on('error', (err) => console.log('Error:', err.message));

