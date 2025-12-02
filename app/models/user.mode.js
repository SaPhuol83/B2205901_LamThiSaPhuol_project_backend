const mongoose = require("mongoose");
const testEmail = require("email-validator");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },

  username: {
    type: String,
    required: [true, "Username is required"],
  },

  birth: {
    type: Date,
    required: [true, "Date of birth is required"],
  },

  gender: {
    type: Boolean,
    required: [true, "Gender male or female is required"],
  },

  address: {
    type: String,
    required: [true, "Address is required"],
  },

  phone: {
    type: String,
    required: [true, "Phone is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
});

// UserSchema.path('email').validate(async function (value) {
//     return testEmail.validate(value);
// }, 'Email is not valid.');

const User = mongoose.model("User", UserSchema);

module.exports = User;
