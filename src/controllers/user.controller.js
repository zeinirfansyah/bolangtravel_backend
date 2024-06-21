const { Users } = require("../models");
const bcrypt = require("bcryptjs");

const getUsers = async (req, res, _next) => {
  try {
    const users = await Users.findAll({
      attributes: {
        exclude: ["password"],
      },
    });

    if (users.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No users found",
        data: null,
      });
    }

    return res.status(200).send({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const getUserById = async (req, res, _next) => {
  try {
    const { id } = req.params;
    const user = await Users.findOne({
      where: { id },
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Users not found",
        data: null,
      });
    }

    return res.status(200).send({
      success: true,
      message: "Users retrieved successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const createUser = async (req, res, _next) => {
  try {
    const { fullname, phone, address, username, email, password, role } =
      req.body;

    if (
      !fullname ||
      !phone ||
      !address ||
      !username ||
      !email ||
      !password
    ) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields",
        data: null,
      });
    }

    const existingUser = await Users.findOne({ where: { username } });
    const existingEmail = await Users.findOne({ where: { email } });

    if (existingUser || existingEmail) {
      return res.status(400).send({
        success: false,
        message: "Username or email already exists",
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Users.create({
      fullname,
      phone,
      address,
      username,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).send({
      success: true,
      message: "Users created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const updateUser = async (req, res, _next) => {
  try {
    const { id } = req.params;
    const { fullname, phone, address, username, email, password, role } =
      req.body;

    if (
      !fullname ||
      !phone ||
      !address ||
      !username ||
      !email ||
      !password ||
      !role
    ) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields",
        data: null,
      });
    }

    const user = await Users.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Users not found",
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await user.update({
      fullname,
      phone,
      address,
      username,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(200).send({
      success: true,
      message: "Users updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const deleteUser = async (req, res, _next) => {
  try {
    const { id } = req.params;
    const user = await Users.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Users not found",
        data: null,
      });
    }

    await user.destroy();

    return res.status(200).send({
      success: true,
      message: "Users deleted successfully",
      data: null,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const updateProfile = async (req, res, _next) => {
  try {
    const { id } = req.user;
    const { fullname, phone, address, username, email, password } = req.body;

    if (!fullname || !phone || !address || !username || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields",
        data: null,
      });
    }

    const user = await Users.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Users not found",
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await user.update({
      fullname,
      phone,
      address,
      username,
      email,
      password: hashedPassword,
    });

    return res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const deleteProfile = async (req, res, _next) => {
  try {
    const { id } = req.user;
    const user = await Users.findOne({ where: { id } });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Users not found",
        data: null,
      });
    }

    await user.destroy();

    return res.status(200).send({
      success: true,
      message: "Profile deleted successfully",
      data: null,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  deleteProfile,
};
