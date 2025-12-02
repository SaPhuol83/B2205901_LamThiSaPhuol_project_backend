const mongoose = require("mongoose");

const bookBorrowSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  staff_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    required: false, // Không bắt buộc, chỉ cập nhật khi duyệt
  },

  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },

  // quantity: {
  //   type: Number,
  //   required: [true, "Quantity is required"],
  // },

  borrow_date: { type: Date, default: Date.now },

  return_date: { type: Date },

  status: {
    type: String,
    enum: ["borrowed", "returned"],
    default: "borrowed",
  },
});

const BookBorrow = mongoose.model("BookBorrow", bookBorrowSchema);
module.exports = BookBorrow;
