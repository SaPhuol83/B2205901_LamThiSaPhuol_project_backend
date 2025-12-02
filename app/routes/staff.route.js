const express = require("express");
const staffController = require("../controllers/staff.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/login", staffController.login);

router
  .route("/")
  .get(staffController.findAll)
  .post(staffController.create)
  .delete(auth, staffController.deleteAll);

router
  .route("/:id")
  .get(auth, staffController.findOne)
  .put(auth, staffController.update)
  .delete(auth, staffController.delete);

module.exports = router;
