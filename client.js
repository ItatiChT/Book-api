import net from 'net';


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


client.on('data', (data) => {
    console.log('Respuesta del servidor:', data.toString());
});


client.on('end', () => console.log('Desconectado del servidor.'));
client.on('error', (err) => console.log('Error:', err.message));