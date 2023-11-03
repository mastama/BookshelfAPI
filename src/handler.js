const { nanoid } = require("nanoid");
const books = require("./books");
const logger = require("./logger");

const addBookHandler = (request, h) => {
    logger.info("Start proses membuat buku")
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

    try {
        if (name === undefined || name === null || name === "") {
            const response = h.response({
                status: "fail",
                message: "Gagal menambahkan buku. Mohon isi nama buku",
            });
            response.code(400);
            logger.error("Gagal menambahkan buku. Mohon isi nama buku", {
                name: newBooks.name
            });
            return response;
        } else if (readPage > pageCount) {
            const response = h.response({
                status: "fail",
                message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
            });
            response.code(400);
            logger.error("Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount", {
                readPage: newBooks.readPage,
                pageCount: newBooks.pageCount
            });
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
            logger.info("End proses membuat buku", {
                bookId: newBooks.bookId
            })
            return response;
        }
    } catch (error) {
        logger.error("Terjadi error:", error);
        throw error;
    }
}


module.exports = {addBookHandler}