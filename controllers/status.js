const { validationResult } = require("express-validator");
const User = require("../models/user");

exports.getStatus = (req, res, next) => {
  User.findById(req.userId)
    .then(user => {
      if (!user) {
        const error = new Error("Could not find user!");
        error.statusCode = 404;
        throw error;
      }
      const status = user.status;
      res.status(200).json({ status: status });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postStatus = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    throw error;
  }
  const newStatus = req.body.status;

  User.findById(req.userId)
    .then(user => {
      if (!user) {
        const error = new Error("Could not find user!");
        error.statusCode = 404;
        throw error;
      }

      user.status = newStatus;
      return user.save();
    })
    .then(result => {
      res
        .status(200)
        .json({ message: "UPDATED STATUS", status: result.status });
      console.log("Updated Status: ", result.status);
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
