const express = require("express");
const bookBorrowController = require("../controllers/bookborrow.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router
  .route("/")
  .get(auth, bookBorrowController.findAll)
  .post(bookBorrowController.create)
  .delete(auth, bookBorrowController.deleteAll);

router
  .route("/:id")
  .get(auth, bookBorrowController.findOne)
  .put(auth, bookBorrowController.update)
  .delete(auth, bookBorrowController.delete);

module.exports = router;
