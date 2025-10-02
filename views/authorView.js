//Formateamos la información que se va a mostrar}

const responseView ={
    formatResponse: (data) => {
        return JSON.stringify(data, null, 2);
    }
}

export { responseView };