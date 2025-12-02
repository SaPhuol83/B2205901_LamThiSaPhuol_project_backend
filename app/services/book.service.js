const { ObjectId } = require("mongodb");
const multer = require("multer");
const path = require("path");

class BookService {
  constructor(client) {
    this.Book = client.db().collection("books");
  }

  static imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads/books");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
  });

  static uploadImage = multer({ storage: BookService.imageStorage });

  extractBookData(payload, image_url) {
    const book = {
      title: payload.title,
      price: payload.price,
      quantity: payload.quantity,
      publisher_year: payload.publisher_year,
      publisher_id: payload.publisher_id,
      author: payload.author,
      description: payload.description,
      image: image_url,
    };
    Object.keys(book).forEach(
      (key) => book[key] === undefined && delete book[key]
    );
    return book;
  }

  async create(payload, image_url) {
    const book = this.extractBookData(payload, image_url);
    return await this.Book.insertOne(book);
  }

  async find(filter) {
    return await this.Book.find(filter).toArray();
  }

  async findById(id) {
    return await this.Book.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload, image_url) {
    const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
    const update = this.extractBookData(payload, image_url);
    return await this.Book.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
  }

  async delete(id) {
    return await this.Book.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async deleteAll() {
    return (await this.Book.deleteMany({})).deletedCount;
  }
}

module.exports = { BookService, uploadImage: BookService.uploadImage };
