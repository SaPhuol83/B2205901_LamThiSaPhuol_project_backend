const StaffService = require("../services/staff.service");
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
    const staffService = new StaffService(MongoDB.client);
    const existingStaff = await staffService.findByUsername(req.body.username);
    if (existingStaff) {
      return next(new ApiError(400, "Username already exists"));
    }

    // req.body.password = await bcrypt.hash(req.body.password, 10);

    const document = await staffService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while creating an staff"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const staffService = new StaffService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await staffService.findByName(name);
    } else {
      documents = await staffService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving staff"));
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const staffService = new StaffService(MongoDB.client);
    const document = await staffService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Staff not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving staff with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Update data cannot be empty"));
  }

  try {
    const staffService = new StaffService(MongoDB.client);
    const document = await staffService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Staff not found"));
    }
    return res.send({ message: "Staff updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating Staff with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const staffService = new StaffService(MongoDB.client);
    const document = await staffService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Staff not found"));
    }
    return res.send({ message: "Staff deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Cannot delete staff with id=${req.params.id}`)
    );
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const staffService = new StaffService(MongoDB.client);
    const deleteCount = await staffService.deleteAll();
    return res.send({
      message: `${deleteCount} staff have been successfully deleted`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while deleting all staff")
    );
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new ApiError(400, "Username and password cannot be empty"));
  }

  try {
    const staffService = new StaffService(MongoDB.client);
    const staff = await staffService.findByUsername(username);

    if (!staff) {
      return next(new ApiError(401, "Account does not exist"));
    }

    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) {
      return next(new ApiError(401, "Incorrect password"));
    }

    const token = jwt.sign(
      { id: staff._id, username: staff.username },
      "secret_key",
      { expiresIn: "1h" }
    );

    res.send({
      token,
      staff: {
        id: staff._id,
        name: staff.name,
        position: staff.position,
      },
    });
  } catch (error) {
    return next(new ApiError(500, "Error during login"));
  }
};
