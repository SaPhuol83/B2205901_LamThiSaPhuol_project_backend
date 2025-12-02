const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

class StaffService {
  constructor(client) {
    this.Staff = client.db().collection("staffs");
  }

  extractStaffData(payload) {
    const staff = {
      name: payload.name,
      username: payload.username,
      password: payload.password,
      position: payload.position,
      address: payload.address,
      phone: payload.phone,
      email: payload.email,
    };

    Object.keys(staff).forEach(
      (key) => staff[key] === undefined && delete staff[key]
    );
    return staff;
  }

  async create(payload) {
    const staff = this.extractStaffData(payload);
    staff.password = await bcrypt.hash(staff.password, 10);
    return await this.Staff.insertOne(staff);
  }

  async find(filter) {
    const cursor = await this.Staff.find(filter);
    return cursor.toArray();
  }

  async findById(id) {
    return await this.Staff.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  }

  async findByUsername(username) {
    return await this.Staff.findOne({ username });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    const existingStaff = await this.Staff.findOne(filter);
    if (!existingStaff) {
      throw new Error("Staff not found");
    }

    if (payload.password && payload.password !== existingStaff.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    } else {
      payload.password = existingStaff.password;
    }

    const update = this.extractStaffData(payload);

    const result = await this.Staff.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );

    return result;
  }

  async delete(id) {
    return await this.Staff.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async deleteAll() {
    const result = await this.Staff.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = StaffService;
