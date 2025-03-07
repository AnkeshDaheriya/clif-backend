const { console } = require("inspector");
const BookModel = require("../../models/admin/adminBook");
const stringSimilarity = require("string-similarity");
const BookProgress = require("../../models/admin/bookProgress");
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
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting the book" });
  }
};

const searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    console.log(query);

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required",
      });
    }

    // First get potential matches using regex for better performance
    const potentialMatches = await BookModel.find({
      isDeleted: false,
      $or: [
        { book_name: { $regex: query, $options: "i" } },
        { book_description: { $regex: query, $options: "i" } },
        { book_tags: { $regex: query, $options: "i" } },
      ],
    });

    // If no potential matches, get a sample of recent books to compare
    console.log("Potential matches", potentialMatches);
    let booksToScore = potentialMatches;
    if (potentialMatches.length < 5) {
      const recentBooks = await BookModel.find()
        .sort({ createdAt: -1 })
        .limit(50);

      // Merge and remove duplicates based on book _id
      const combinedBooks = [...potentialMatches, ...recentBooks];
      booksToScore = combinedBooks.filter(
        (book, index, self) =>
          index ===
          self.findIndex((b) => b._id.toString() === book._id.toString())
      );
    }

    // Calculate similarity scores
    const scoredBooks = booksToScore.map((book) => {
      // Create a comprehensive text representation of the book
      const bookText = `${book.book_name || ""} ${
        book.book_description || ""
      } ${book.book_author || ""} ${book.book_tags.join(" ") || ""} ${
        book.book_type || ""
      }`.toLowerCase();

      // Calculate similarity
      const similarityScore =
        stringSimilarity.compareTwoStrings(query.toLowerCase(), bookText) * 100; // Convert to 0-100 scale

      // Apply additional weighting for tags match
      let tagBoost = 0;

      // Check if tags exist before splitting
      if (book.book_tags.length > 0) {
        if (
          book.book_tags.some(
            (tag) =>
              query.toLowerCase().includes(tag.toLowerCase()) ||
              tag.toLowerCase().includes(query.toLowerCase())
          )
        ) {
          tagBoost = 20; // Boost score if query directly relates to book tags
        }
      }

      // Apply author boost - check if author exists
      const authorBoost =
        book.book_author &&
        book.book_author.toLowerCase().includes(query.toLowerCase())
          ? 15
          : 0;

      // Final score with boosts
      const finalScore = Math.min(
        100,
        similarityScore + tagBoost + authorBoost
      );

      return {
        ...book.toObject(),
        relevanceScore: finalScore,
      };
    });

    // Sort by similarity score and filter out low-relevance results
    const sortedBooks = scoredBooks
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .filter((book) => book.relevanceScore > 25); // Minimum relevance threshold

    console.log(sortedBooks);

    res.json({
      success: true,
      books: sortedBooks,
    });
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching book details",
      error: error.message,
    });
  }
};

const getBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    console.log(bookId);
    const book = await BookModel.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book fetched successfully", data: book });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the book" });
  }
};

const bookProgress = async (req, res) => {
  const { book_id, user_id, current_page, progress } = req.body;
  console.log("Request body:", req.body); // Log request body to verify the data

  try {
    // Check if the fields are being passed
    if (
      !book_id ||
      !user_id ||
      current_page === undefined ||
      progress === undefined
    ) {
      console.error("Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    let existingProgress = await BookProgress.findOne({
      // Find the existing book progress record for the given user and book
      book_id: book_id,
      user_id: user_id,
    });
    console.log("existing Progress", existingProgress);
    if (existingProgress) {
      // If the existing progress is less than the new progress, update it
      if (existingProgress.progress < progress) {
        existingProgress.current_page = current_page;
        existingProgress.progress = progress;

        await existingProgress.save();
        console.log("Updated progress:", existingProgress); // Log the updated progress
        return res.status(200).json({
          message: "Book progress updated successfully",
          existingProgress,
        });
      } else {
        return res.status(200).json({
          message:
            "No update needed, existing progress is greater than or equal to new progress",
        });
      }
    } else {
      const newProgress = new BookProgress({
        book_id: book_id,
        user_id: user_id,
        current_page: current_page,
        progress: progress,
      });

      await newProgress.save();
      console.log("Created new progress:", newProgress); // Log the new progress created
      return res
        .status(201)
        .json({ message: "Book progress created successfully", newProgress });
    }
  } catch (error) {
    console.error("Error updating progress:", error); // Log the error to get more details
    return res.status(500).json({
      message: "An error occurred while updating book progress",
      error: error.message,
    });
  }
};

const getBookProgress = async (req, res) => {
  const { book_id, user_id } = req.body;
  try {
    const progress = await BookProgress.findOne({
      book_id: book_id,
      user_id: user_id,
    });
    if (progress) {
      console.log("Book progress found:", progress); // Log the found progress
      return res.status(200).json({
        message: "Book progress fetched successfully",
        progress,
      });
    }
  } catch (error) {
    console.error("Error fetching book progress:", error); // Log the error to get more details
    return res.status(500).json({
      message: "An error occurred while fetching book progress",
      error: error.message,
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { book_id, user_id } = req.body;
    const progress = await BookProgress.findOne({
      book_id: book_id,
      user_id: user_id,
    });
    if (progress) {
      progress.progress = 100;
      await progress.save().then(() => {
        BookModel.findOneAndUpdate(
          {
            _id: book_id,
          },
          { $set: { isRead: true } },
          { new: true }
        );
      });
      console.log("Marked as read:", progress); // Log the updated progress
      return res.status(200).json({
        message: "Book marked as read successfully",
        progress,
      });
    } else {
      const newProgress = await BookProgress.create({
        book_id: book_id,
        user_id: user_id,
        current_page: 0,
        progress: 100,
      });
      newProgress.save().then(() => {
        BookModel.findOneAndUpdate(
          {
            _id: book_id,
          },
          { $set: { isRead: true } },
          { new: true }
        );
      });
    }
  } catch (error) {
    console.error("Error marking book as read:", error); // Log the error to get more details
    return res.status(500).json({
      message: "An error occurred while marking book as read",
      error: error.message,
    });
  }
};

module.exports.addBook = addBook;
module.exports.getAllBooks = getAllBooks;
module.exports.deleteBook = deleteBook;
module.exports.searchBooks = searchBooks;
module.exports.getBook = getBook;
module.exports.bookProgress = bookProgress;
module.exports.getBookProgress = getBookProgress;
module.exports.markAsRead = markAsRead;
