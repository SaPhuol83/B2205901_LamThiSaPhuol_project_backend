const mongoose = require("mongoose");

const StaffSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },

  username: {
    type: String,
    required: [true, "Username is required"],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },

  position: {
    type: String,
    default: "Customer care staff",
  },

  address: {
    type: String,
    required: [true, "Address is required"],
  },

  phone: {
    type: String,
    required: [true, "Phone is required"],
  },

  email: {
    type: String,
    required: ["Email is required"],
  },
});

const Staff = mongoose.model("Staff", StaffSchema);

module.exports = Staff;
