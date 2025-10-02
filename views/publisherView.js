const responseView ={
    formatResponse: (data) => {
        return JSON.stringify(data, null, 2);
    }
}

export { responseView };