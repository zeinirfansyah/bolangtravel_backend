const { isEmail, isStrongPassword } = require("validator");
const { User: UserModel } = require("../models");

const validateRegister = async (req, res, next) => {
  const { fullName, phone, address, username, email, password } = req.body;

  if (!fullName || !phone || !address || !username || !email || !password) {
    return res.status(400).send({
      message: "Bad request",
      data: null,
    });
  }

  if (!isEmail(email)) {
    return res.status(400).send({
      message: "Invalid email",
      data: null,
    });
  }

  if (
    !isStrongPassword(password, {
      minLength: 4,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 0,
      minSymbols: 0,
    })
  ) {
    return res.status(400).send({
      message: "Password is too weak",
      data: null,
    });
  }

  const emailCheck = await UserModel.findOne({
    where: { email },
  });
  if (emailCheck) {
    return res.status(400).send({
      message: "Email already registered",
      data: null,
    });
  }

  const usernameCheck = await UserModel.findOne({
    where: { username },
  });
  if (usernameCheck) {
    return res.status(400).send({
      message: "Username already registered",
      data: null,
    });
  }

  next();
};


const validateLogin = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({
      message: "Bad request",
      data: null,
    });
  }

  next();
};

module.exports = { validateRegister, validateLogin };
