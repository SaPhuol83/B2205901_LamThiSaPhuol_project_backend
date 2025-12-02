const { ObjectId } = require("mongodb");

class PublisherService {
  constructor(client) {
    this.Publisher = client.db().collection("publishers");
  }

  extractPublisherData(payload) {
    const publisher = {
      name: payload.name,
      address: payload.address,
      //   phone: payload.phone,
      //   email: payload.email,
    };

    Object.keys(publisher).forEach(
      (key) => publisher[key] === undefined && delete publisher[key]
    );
    return publisher;
  }

  async create(payload) {
    const publisher = this.extractPublisherData(payload);
    return await this.Publisher.insertOne(publisher);
  }

  async find(filter) {
    return await this.Publisher.find(filter).toArray();
  }

  async findById(id) {
    return await this.Publisher.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
    const update = this.extractPublisherData(payload);
    return await this.Publisher.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
  }

  async delete(id) {
    return await this.Publisher.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async deleteAll() {
    return (await this.Publisher.deleteMany({})).deletedCount;
  }
}

module.exports = PublisherService;
