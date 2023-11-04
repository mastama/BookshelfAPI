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
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBooks = {
        id,
        name,
        year, 
        author, 
        summary, 
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
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
                    id : id,
                },
            });
            response.code(201);
            logger.info("membuat buku: ", newBooks)
            logger.info("End proses membuat buku", {
                id: newBooks.id
            })
            return response;
        }
    } catch (error) {
        logger.error("Terjadi error: ", error);
        throw error;
    }
}

const getAllBookHandler = (_, h) => {
    logger.info("Start proses menampilkan seluruh buku")
    try {
        const newBooks = books.map(book => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
            }))

        const response = h.response({
            status: "success",
            data: {
                newBooks
            },
        })
        response.code(200);
        logger.info("menampilkan buku: ", newBooks)
        logger.info("End proses menampilkan seluruh buku", newBooks.id)
        return response;
    } catch(error) {
        logger.error("Terjadi error: ", error)
        throw error;
    }
};


module.exports = {addBookHandler, getAllBookHandler}