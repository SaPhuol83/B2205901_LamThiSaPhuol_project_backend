const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.create = async (req, res, next) => {
  if (!req.body?.name || !req.body?.username || !req.body?.password) {
    return next(
      new ApiError(400, "Name, username, and password cannot be empty")
    );
  }

  try {
    const userService = new UserService(MongoDB.client);
    const existingUser = await userService.findByUsername(req.body.username);
    if (existingUser) {
      return next(new ApiError(400, "Username already exists"));
    }
    // req.body.password = await bcrypt.hash(req.body.password, 10);

    const document = await userService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.error("Error creating reader:", error);
    return next(new ApiError(500, "An error occurred while creating the user"));
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new ApiError(400, "Username and password cannot be empty"));
  }

  try {
    const userService = new UserService(MongoDB.client);
    const user = await userService.findByUsername(username);

    if (!user) {
      return next(new ApiError(401, "Account does not exist"));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new ApiError(401, "Incorrect password"));
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      "secret_key",
      { expiresIn: "1h" }
    );

    res.send({ token, user: { id: user._id, name: user.name } });
  } catch (error) {
    console.error("Error logging in:", error);
    return next(new ApiError(500, "Error during login"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const userService = new UserService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await userService.findByName(name);
    } else {
      documents = await userService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving users"));
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const document = await userService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "User not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving user with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Update data cannot be empty"));
  }

  try {
    const userService = new UserService(MongoDB.client);
    const document = await userService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "User not found"));
    }

    return res.send({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return next(
      new ApiError(500, `Error updating user with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const document = await userService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "User not found"));
    }
    return res.send({ message: "User deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Cannot delete user with id=${req.params.id}`)
    );
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const deleteCount = await userService.deleteAll();
    return res.send({
      message: `${deleteCount} users have been successfully deleted`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while deleting all users")
    );
  }
};
