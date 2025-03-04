const exp = require('express');
const { addBook, getAllBooks, deleteBook } = require('../../controllers/admin/adminBooks');
const router = exp.Router();

module.exports = (upload) =>{
    router.post('/add-book', upload.single('bookFile'), addBook);
    router.get('/books-list', getAllBooks);
    router.post('/delete-book', deleteBook);
    return router;
}