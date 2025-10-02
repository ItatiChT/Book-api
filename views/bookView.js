const responseView ={
    formatResponse: (data) => {
        return JSON.stringify(data, null, 2);
    }
}

export { responseView };



/*
function renderList(books) {
  return { status: 'ok', count: books.length, books };
}

function renderDetail(book) {
  if (!book) {
    return { status: 'error', message: 'Libro no encontrado' };
  }
  return { status: 'ok', book };
}

function renderMessage(msg) {
  return { status: 'ok', message: msg };
}

module.exports = { renderList, renderDetail, renderMessage };
