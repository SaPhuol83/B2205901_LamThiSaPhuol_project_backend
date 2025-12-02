const { BookService } = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  console.log("req.body: ", req.body);
  console.log("req.file:", req.file);

  if (!req.body?.title) {
    return next(new ApiError(400, "Book title cannot be empty"));
  }
  try {
    const bookService = new BookService(MongoDB.client);
    const image_url = req.file ? `/uploads/books/${req.file.filename}` : null;
    const document = await bookService.create(req.body, image_url);
    return res.status(201).json(document);
  } catch (error) {
    return next(new ApiError(500, "Error creating the book"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const bookService = new BookService(MongoDB.client);
    const { title } = req.query;
    if (title) {
      documents = await bookService.findByName(title);
    } else {
      documents = await bookService.find({});
    }
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving the list of books")
    );
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving book with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);

  if (Object.keys(req.body).length === 0 && !req.file) {
    return next(new ApiError(400, "Data to update cannot be empty"));
  }

  try {
    const bookService = new BookService(MongoDB.client);
    const image_url = req.file
      ? `/uploads/books/${req.file.filename}`
      : req.body.image || null;
    delete req.body.image;
    const document = await bookService.update(
      req.params.id,
      req.body,
      image_url
    );

    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }

    return res.send({ message: "Book updated successfully", document });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating book with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send({ message: "Book deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete book with id=${req.params.id}`)
    );
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const deleteCount = await bookService.deleteAll();
    return res.send({
      message: `${deleteCount} books were deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while deleting all books")
    );
  }
};
