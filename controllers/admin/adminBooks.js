const { console } = require("inspector");
const BookModel = require("../../models/admin/adminBook");
const path = require("path");

const addBook = async (req, res) => {
  try {
    // Extract fields from the request body
    const {
      bookName,
      bookAuthor,
      totalPages,
      bookType,
      bookDescription,
      bookTags,
    } = req.body;

    const bookFile = req.file;
    console.log("file name", bookFile);

    if (!bookFile) {
      return res.status(400).json({ message: "Book file is required" });
    }

    // Build the file path (you can use `path.join` for cross-platform compatibility)
    const filePath = path.join("books", bookFile.filename); // bookFile.filename is the filename stored by multer

    // Create a new book document
    const newBook = new BookModel({
      book_name: bookName,
      book_author: bookAuthor,
      total_pages: totalPages,
      book_type: bookType,
      book_description: bookDescription,
      book_tags: bookTags,
      book_file: filePath,
    });

    // Save the new book to the database
    await newBook.save();

    // Send the success response
    res.status(201).json({
      message: "Book added successfully",
      book: newBook,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while adding the book" });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await BookModel.find({
      isDeleted: false,
    });
    res.status(200).json({
      message: "All books",
      data: books,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the books" });
  }
};
const deleteBook = async (req, res) => {
  const { id } = req.body;
  try {
    await BookModel.findByIdAndUpdate(id, { isDeleted: true });
    return res.status(200).json({ 
      message: "Book deleted successfully" 
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting the book" });
  }
};

module.exports.addBook = addBook;
module.exports.getAllBooks = getAllBooks;
module.exports.deleteBook = deleteBook;