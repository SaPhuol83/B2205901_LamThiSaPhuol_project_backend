const express = require("express");
const path = require("path");
const cors = require("cors");
const ApiError = require("./app/api-error");

const app = express();

const publisherRouter = require("./app/routes/publisher.route");
const userRouter = require("./app/routes/user.route");
const staffRouter = require("./app/routes/staff.route");
const bookRouter = require("./app/routes/book.route");
const bookBorrow = require("./app/routes/bookborrow.route");

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/publishers", publisherRouter);
app.use("/api/users", userRouter);
app.use("/api/staffs", staffRouter);
app.use("/api/books", bookRouter);
app.use("/api/bookborrows", bookBorrow);

app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to connect Libary" });
});

module.exports = app;
