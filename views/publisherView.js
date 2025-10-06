// Formatear la información que se enviará al cliente TCP
const responseView = {
    formatResponse: (data) => {
        try {
            // Convertimos cualquier dato a JSON legible
            return JSON.stringify(data, null, 2);
        } catch (err) {
            // Si ocurre un error, devolvemos un mensaje de error en JSON
            return JSON.stringify({ error: 'Error al formatear la respuesta: ' + err.message }, null, 2);
        }
    }
};

export { responseView };
