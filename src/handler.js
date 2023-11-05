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
                    bookId : id,
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

const getAllBookHandler = (request, h) => {
    logger.info("Start proses menampilkan seluruh buku")
    try {
        const simplifiedBooks = books.map(book => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
        }));

        const response = h.response({
            status: "success",
            data: {
                books: simplifiedBooks
            }
        }).code(200);

        logger.info("menampilkan buku: ", simplifiedBooks);
        logger.info("End proses menampilkan seluruh buku");

        return response;
    } catch (error) {
        logger.error("Terjadi error: ", error);
        throw error;
    }
};

const getBookByIdHandler = (request, h) => {
    logger.info("Start proses menampilkan buku berdasarkan id")
    const {id} = request.params;
    const book = books.filter((b) => b.id === id)[0];

    try {
        if (book !== undefined) {
            const response = h.response({
                status: "success",
                data: {
                    book,
                }
            })
            response.code(200);
            logger.info("menampilkan buku byId: ", book);
            logger.info("End proses menampilkan buku berdasarakan id", {id: id});

            return response;
        } else {
            const response = h.response({
                status: "fail",
                message: "Buku tidak ditemukan"
            })
            response.code(404);
            logger.info("Buku dengan id tidak ditemukan: ", {id: id});
            logger.info("End proses menampilkan buku berdasarakan id: ", {id: id});

            return response;
        }
    } catch (error) {
        logger.info("Terjadi error: ", error)
        throw error;
    }
}

const editBookByIdHandler = (request, h) => {
    logger.info("Start proses memperbarui data buku");

    const {id} = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();
    const insertedAt = updatedAt;

    try {
        if (name === undefined || name === "" || name === null) {
            const response = h.response({
                status: "fail",
                message: "Gagal memperbarui buku. Mohon isi nama buku",
            }).code(400);
            logger.error("Gagal memperbarui buku. Mohon isi nama buku");
            return response;
        } else if (readPage > pageCount) {
            const response = h.response({
                status: "fail",
                message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
            }).code(400);
            logger.error("Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount", {
                readPage: readPage,
                pageCount: pageCount,
            });
            return response;
        };

        const index = books.findIndex((book) => book.id === id);
        
        if (index !== -1) {
            books[index] = {
                ...books[index],
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading,
                updatedAt,
                insertedAt,
            };
            const response = h.response({
                status: "success",
                message: "Buku berhasil diperbarui"
            });
            response.code(200);
            logger.info("End proses memperbarui data buku")
            return response;
        } else {
            const response = h.response({
                status: "fail",
                message: "Gagal memperbarui buku. Id tidak ditemukan"
            });
            response.code(404);
            logger.error("Gagal memperbarui buku. Id tidak ditemukan", {id: id});
            return response;
        }
    } catch (error) {
        logger.error("Terjadi error: ", error);
        throw error;
    }
};

const deleteBookByIdHandler = (request, h) => {
    logger.info("Start proses delete data buku");
    const {id} = request.params;
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: "success",
            message: "Buku berhasil dihapus"
        });
        response.code(200);
        logger.info("End proses delete data buku", {id: id});
        return response;
    } else {
        const response = h.response({
            status: "fail",
            message: "Buku gagal dihapus. Id tidak ditemukan"
        }).code(404);
        logger.error("Buku gagal dihapus. Id tidak ditemukan", {id: id})
        return response;
    }
}



module.exports = {addBookHandler, getAllBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler}