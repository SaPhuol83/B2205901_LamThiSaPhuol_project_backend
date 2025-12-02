const express = require("express");
const bookController = require("../controllers/book.controller");
const { BookService, uploadImage } = require("../services/book.service");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router
  .route("/")
  .get(bookController.findAll)
  .post(BookService.uploadImage.single("image"), bookController.create)
  .delete(auth, bookController.deleteAll);

router
  .route("/:id")
  .get(auth, bookController.findOne)
  .put(auth, BookService.uploadImage.single("image"), bookController.update)
  .delete(auth, bookController.delete);

module.exports = router;
