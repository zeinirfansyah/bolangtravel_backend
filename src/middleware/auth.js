const jwt = require("jsonwebtoken");
const { User } = require("../models");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"] || "";

    if (authHeader.split(" ").length !== 2) {
      return res.status(401).send({
        message: "Must be logged in",
        data: null,
      });
    }

    const token = authHeader.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user) {
      return res.status(401).send({
        message: "Must be logged in",
        data: null,
      });
    }

    req.user = user;

    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).send({
        message: "Invalid token",
        data: null,
      });
    }

    next(err);
  }
};

const authorizeRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send({
          message: "User not found",
          data: null,
        });
      }

      if (user.role !== requiredRole) {
        return res.status(403).send({
          message: "You do not have the required role to access this resource",
          data: null,
        });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: "Internal server error",
        data: null,
      });
    }
  };
};

module.exports = { verifyToken, authorizeRole };
