const { MongoClient } = require("mongodb");

class MongoDB {
  static client;

  static async connect(uri) {
    if (!this.client) {
      // Không dùng options cũ nữa
      this.client = new MongoClient(uri);

      await this.client.connect();
      console.log("Connected to MongoDB");
    }
    return this.client;
  }
}

module.exports = MongoDB;
