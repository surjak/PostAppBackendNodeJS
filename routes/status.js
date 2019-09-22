const express = require("express");
const statusController = require("../controllers/status");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/get", isAuth, statusController.getStatus);
router.post(
  "/post",
  isAuth,
  [
    body("status")
      .trim()
      .not()
      .isEmpty()
  ],
  statusController.postStatus
);
module.exports = router;
