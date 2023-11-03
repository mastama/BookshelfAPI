const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
    console.log("Start proses membuat buku")
    const {name, 
        year, 
        author, 
        summary, 
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const finished = pageCount === readPage;
    const bookId = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBooks = {name,
        year, 
        author, 
        summary, 
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        bookId,
        insertedAt,
        updatedAt
    };

    // masukan payload kedalam array books
    books.push(newBooks);
    console.log("TROUBLESHOOT: ", newBooks)

    try {
        if (name === undefined || name === null || name === "") {
            const response = h.response({
                status: "fail",
                message: "Gagal menambahkan buku. Mohon isi nama buku",
            });
            response.code(400);
            console.error("Gagal menambahkan buku. Mohon isi nama buku");
            return response;
        } else if (readPage > pageCount) {
            const response = h.response({
                status: "fail",
                message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
            });
            response.code(400);
            console.error("Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount")
            return response;
        } else {
            const response = h.response({
                status: "success",
                message: "Buku berhasil ditambahkan",
                data: {
                    bookId : bookId,
                },
            });
            response.code(201);
            console.log("End proses membuat buku")
            return response;
        }
    } catch (error) {
        throw error;
    }
}


module.exports = {addBookHandler}