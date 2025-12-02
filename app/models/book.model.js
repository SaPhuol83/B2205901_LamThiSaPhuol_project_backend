const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Name is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
  },
  publisher_year: {
    type: Number,
    required: [true, "Publishing Year is required"],
  },
  publisher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publisher",
    required: [true, "Publisher id is required"],
  },
  author: {
    type: String,
    required: [true, "Author is required"],
  },
  description: {
    type: String,
    default: "Chưa có mô tả",
  },
  image: {
    type: String,
    default: "",
  },
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
