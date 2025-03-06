const exp = require("express");
const {
  addBook,
  getAllBooks,
  deleteBook,
  searchBooks,
  getBook,
  bookProgress,
  getBookProgress,
  markAsRead,
} = require("../../controllers/admin/adminBooks");
const router = exp.Router();

module.exports = (upload) => {
  router.post("/add-book", upload.single("bookFile"), addBook);
  router.get("/books-list", getAllBooks);
  router.get("/get-book/:bookId", getBook);
  router.post("/delete-book", deleteBook);
  router.get("/search", searchBooks);
  router.post("/book-progress", bookProgress);
  router.post("/get-book-progress", getBookProgress);
  router.post("/mark-as-read", markAsRead);
  return router;
};
