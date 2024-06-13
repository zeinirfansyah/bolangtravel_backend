const jwt = require("jsonwebtoken");
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"] || "";

    if (authHeader.split(" ").length !== 2) {
      return res.status(401).send({
        message: "Invalid token",
        data: null,
      });
    }

    const token = authHeader.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user) {
      return res.status(401).send({
        message: "Invalid token",
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

module.exports = { verifyToken };
