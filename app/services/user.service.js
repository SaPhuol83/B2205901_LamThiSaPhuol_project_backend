const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

class UserService {
  constructor(client) {
    this.User = client.db().collection("users");
  }

  extractUserData(payload) {
    const user = {
      name: payload.name,
      username: payload.username,
      password: payload.password,
      birth: payload.birth ? new Date(payload.birth) : undefined,
      email: payload.email,
      phone: payload.phone,
      gender: payload.gender,
      address: payload.address,
      //   role: payload.role || "user", // Mặc định là "user"
    };

    Object.keys(user).forEach(
      (key) => user[key] === undefined && delete user[key]
    );
    return user;
  }

  async create(payload) {
    const user = this.extractUserData(payload);

    user.password = await bcrypt.hash(user.password, 10);
    return await this.User.insertOne(user);
  }

  async find(filter) {
    const cursor = await this.User.find(filter);
    return cursor.toArray();
  }

  async findById(id) {
    return await this.User.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  }

  async findByUsername(username) {
    return await this.User.findOne({ username });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const existingUser = await this.User.findOne(filter);
    if (!existingUser) {
      throw new Error("User not found");
    }

    if (payload.password && payload.password !== existingUser.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    } else {
      payload.password = existingUser.password;
    }

    const update = this.extractUserData(payload);

    const result = await this.User.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );

    return result;
  }

  async delete(id) {
    const result = await this.User.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });

    return result;
  }

  async deleteAll() {
    const result = await this.User.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = UserService;
