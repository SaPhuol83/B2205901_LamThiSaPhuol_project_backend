const { ObjectId } = require("mongodb");

class BookBorrowService {
  constructor(client) {
    this.BookBorrow = client.db().collection("book_borrows");
  }

  extractBorrowData(payload) {
    const borrow = {
      user_id: ObjectId.isValid(payload.user_id)
        ? new ObjectId(payload.user_id)
        : null,
      book_id: ObjectId.isValid(payload.book_id)
        ? new ObjectId(payload.book_id)
        : null,
      staff_id: ObjectId.isValid(payload.staff_id)
        ? new ObjectId(payload.staff_id)
        : null,
      borrow_date: payload.borrow_date || new Date(),
      return_date: payload.return_date || null,
      status: payload.status || "borrowed", // "borrowed" hoặc "returned"
    };

    Object.keys(borrow).forEach(
      (key) => borrow[key] === undefined && delete borrow[key]
    );
    return borrow;
  }

  async create(payload) {
    const borrow = this.extractBorrowData(payload);
    return await this.BookBorrow.insertOne(borrow);
  }

  async find(filter) {
    return await this.BookBorrow.find(filter).toArray();
  }

  async findById(id) {
    return await this.BookBorrow.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async findByReader(reader_id) {
    return await this.BookBorrow.find({
      reader_id: ObjectId.isValid(reader_id) ? new ObjectId(reader_id) : null,
    }).toArray();
  }

  async update(id, payload) {
    const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
    const update = this.extractBorrowData(payload);
    return await this.BookBorrow.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
  }

  async markAsReturned(id, return_date = new Date()) {
    const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
    return await this.BookBorrow.findOneAndUpdate(
      filter,
      {
        $set: { status: "returned", return_date },
      },
      { returnDocument: "after" }
    );
  }

  async delete(id) {
    return await this.BookBorrow.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async deleteAll() {
    return (await this.BookBorrow.deleteMany({})).deletedCount;
  }
}

module.exports = BookBorrowService;
