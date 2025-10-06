const responseView = {
    // Formatear cualquier dato como JSON legible para enviar al cliente
    formatResponse: (data) => {
        try {
            return JSON.stringify(data, null, 2);
        } catch (err) {
            // Si ocurre un error al convertir a JSON, devolvemos un mensaje de error
            return JSON.stringify({ error: 'Error al formatear la respuesta: ' + err.message }, null, 2);
        }
    }
};

export { responseView };
