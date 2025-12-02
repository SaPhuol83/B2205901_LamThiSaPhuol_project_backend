const express = require("express");
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/login", userController.login);

router
  .route("/")
  .get(auth, userController.findAll)
  .post(userController.create)
  .delete(auth, userController.deleteAll);

router
  .route("/:id")
  .get(auth, userController.findOne)
  .put(auth, userController.update)
  .delete(auth, userController.delete);

module.exports = router;
