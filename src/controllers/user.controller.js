const { Users } = require("../models");
const bcrypt = require("bcryptjs");
const {
  validatePassword,
  validateEmail,
  validatePhone,
  validateUsername,
  validateRole,
} = require("../utils/validators/user.validator");

const getUsers = async (req, res, _next) => {
  try {
    const users = await Users.findAll({
      attributes: {
        exclude: ["password"],
      },
    });

    if (!users) {
      return res.status(404).send({
        success: false,
        message: "No users found",
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
      message: `Error retrieving user with id ${id}: ${error.message}`,
    });
  }
};

const getAuthenticatedUser = async (req, res, _next) => {
  try {
    const { id } = req.user;
    const user = await Users.findOne({
      where: { id },
      attributes: {
        exclude: ["password"],
      },
    });
    return res.status(200).send({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const createUser = async (req, res, _next) => {
  try {
    const { fullname, phone, address, username, email, password, role } =
      req.body;

    if (!fullname || !phone || !address || !username || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    if (validateUsername(username)) {
      return res.status(400).json({
        message: validateUsername(username),
      });
    }

    if (validatePhone(phone)) {
      return res.status(400).json({
        message: validatePhone(phone),
      });
    }

    if (validateEmail(email)) {
      return res.status(400).json({
        message: validateEmail(email),
      });
    }

    if (validatePassword(password)) {
      return res.status(400).json({
        message: validatePassword(password),
      });
    }

    if (role) {
      if (validateRole(role)) {
        return res.status(400).json({
          message: validateRole(role),
        });
      }
    }

    const existingUser = await Users.findOne({ where: { username } });
    const existingEmail = await Users.findOne({ where: { email } });
    const existingPhone = await Users.findOne({ where: { phone } });

    if (existingUser || existingEmail || existingPhone) {
      return res.status(400).send({
        success: false,
        message: "Username, email, or phone already exists.",
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
      message: `User ${user.username} created successfully`,
      data: user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Error creating user: ${error.message}`,
    });
  }
};

const updateUser = async (req, res, _next) => {
  try {
    const { id } = req.params;
    const updateData = {};

    const user = await Users.findOne({ where: { id } });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Users not found",
      });
    }

    if (req.body.hasOwnProperty("fullname")) {
      updateData.fullname = req.body.fullname;
    }

    if (req.body.hasOwnProperty("username")) {
      if (validateUsername(req.body.username)) {
        return res.status(400).send({
          success: false,
          message: validateUsername(req.body.username),
        });
      }

      if (
        req.body.username !== user.username &&
        (await Users.findOne({ where: { username: req.body.username } }))
      ) {
        return res.status(400).send({
          success: false,
          message: "Username already exists",
        });
      }

      updateData.username = req.body.username;
    }

    if (req.body.hasOwnProperty("phone")) {
      if (validatePhone(req.body.phone)) {
        return res.status(400).send({
          success: false,
          message: validatePhone(req.body.phone),
        });
      }

      if (
        req.body.phone !== user.phone &&
        (await Users.findOne({ where: { phone: req.body.phone } }))
      ) {
        return res.status(400).send({
          success: false,
          message: "Phone number already exists",
        });
      }

      updateData.phone = req.body.phone;
    }

    if (req.body.hasOwnProperty("email")) {
      if (validateEmail(req.body.email)) {
        return res.status(400).send({
          success: false,
          message: validateEmail(req.body.email),
        });
      }

      if (
        req.body.email !== user.email &&
        (await Users.findOne({ where: { email: req.body.email } }))
      ) {
        return res.status(500).send({
          success: false,
          message: "Email already exists",
        });
      }

      updateData.email = req.body.email;
    }

    if (req.body.hasOwnProperty("address")) {
      updateData.address = req.body.address;
    }

    if (req.body.hasOwnProperty("role")) {
      if (validateRole(req.body.role)) {
        return res.status(400).send({
          success: false,
          message: validateRole(req.body.role),
        });
      }

      updateData.role = req.body.role;
    }

    const updatedUser = await user.update(updateData);

    return res.status(200).send({
      success: true,
      message: "Users updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Error updating user: ${error.message}`,
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
      });
    }

    await user.destroy();

    return res.status(200).send({
      success: true,
      message: `User ${user.username} deleted successfully`,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const updateProfile = async (req, res, _next) => {
  try {
    const { id } = req.user;
    const updateProfile = {};

    const user = await Users.findOne({ where: { id } });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Users not found",
      });
    }

    if (req.body.hasOwnProperty("fullname")) {
      updateProfile.fullname = req.body.fullname;
    }

    if (req.body.hasOwnProperty("username")) {
      if (validateUsername(req.body.username)) {
        return res.status(400).send({
          success: false,
          message: validateUsername(req.body.username),
        });
      }

      if (
        req.body.username !== user.username &&
        (await Users.findOne({
          where: { username: req.body.username },
        }))
      ) {
        return res.status(400).send({
          success: false,
          message: "Username already exists",
        });
      }

      updateProfile.username = req.body.username;
    }

    if (req.body.hasOwnProperty("phone")) {
      if (validatePhone(req.body.phone)) {
        return res.status(400).send({
          success: false,
          message: validatePhone(req.body.phone),
        });
      }

      if (
        req.body.phone !== user.phone &&
        (await Users.findOne({ where: { phone: req.body.phone } }))
      ) {
        return res.status(400).send({
          success: false,
          message: "Phone number already exists",
        });
      }

      updateProfile.phone = req.body.phone;
    }

    if (req.body.hasOwnProperty("email")) {
      if (validateEmail(req.body.email)) {
        return res.status(400).send({
          success: false,
          message: validateEmail(req.body.email),
        });
      }

      if (
        req.body.email !== user.email &&
        (await Users.findOne({ where: { email: req.body.email } }))
      ) {
        return res.status(500).send({
          success: false,
          message: "Email already exists",
        });
      }

      updateProfile.email = req.body.email;
    }

    if (req.body.hasOwnProperty("address")) {
      updateProfile.address = req.body.address;
    }

    const updatedUser = await user.update(updateProfile);

    return res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
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

const selfUpdatePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { oldPassword, newPassword } = req.body;

    const user = await Users.findOne({ where: { id } });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Users not found",
        data: null,
      });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "oldPassword and newPassword are required",
        data: null,
      });
    }

    if (validatePassword(newPassword)) {
      return res.status(400).send({
        success: false,
        message: validatePassword(newPassword),
      });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(401).send({
        success: false,
        message: "Your old password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await user.update({ password: hashedPassword });

    return res.status(200).send({
      success: true,
      message: "Password updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Error updating password: ${error.message}`,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, phone, newPassword } = req.body;

    const user = await Users.findOne({ where: { id } });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Users not found",
      });
    }

    if (!email || !phone || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Email, phone, and newPassword are required",
      });
    }

    if (phone !== user.phone) {
      return res.status(400).send({
        success: false,
        message: "Phone does not match",
      });
    }

    if (email !== user.email) {
      return res.status(400).send({
        success: false,
        message: "Email does not match",
      });
    }

    if (validatePassword(newPassword)) {
      return res.status(400).send({
        success: false,
        message: validatePassword(newPassword),
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await user.update({ password: hashedPassword });

    return res.status(200).send({
      success: true,
      message: "Password updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
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
  selfUpdatePassword,
  updatePassword,
  getAuthenticatedUser,
};
