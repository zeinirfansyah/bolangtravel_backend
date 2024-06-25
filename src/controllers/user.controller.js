const { Users } = require("../models");
const bcrypt = require("bcryptjs");
const { isEmail, isStrongPassword } = require("validator");

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

    if (!fullname || !phone || !address || !username || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields",
        data: null,
      });
    }

    const existingUser = await Users.findOne({ where: { username } });
    const existingEmail = await Users.findOne({ where: { email } });
    const existingPhone = await Users.findOne({ where: { phone } });

    if (!isEmail(email)) {
      return res.status(400).send({
        message: "Please provide a valid email",
        data: null,
      });
    }

    if (
      !isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      return res.status(400).send({
        message: [
          "Your password is too weak.",
          "1. Minimum 6 characters long",
          "2. At least contain 1 uppercase letter",
          "3. At least contain 1 lowercase letter",
          "4. At least contain 1 number",
          "5. At least contain 1 special character",
        ],
        data: null,
      });
    }

    if (existingUser || existingEmail || existingPhone) {
      return res.status(400).send({
        success: false,
        message: "Username, email, or phone already exists.",
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
      message: `User ${user.username} created successfully`,
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
    const updateData = {};

    const user = await Users.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Users not found",
        data: null,
      });
    }

    if (req.body.hasOwnProperty("fullname")) {
      updateData.fullname = req.body.fullname;
    }

    if (req.body.hasOwnProperty("address")) {
      updateData.address = req.body.address;
    }

    if (req.body.hasOwnProperty("phone")) {
      updateData.phone = req.body.phone;
      if (
        updateData.phone !== user.phone &&
        (await Users.findOne({ where: { phone: updateData.phone } }))
      ) {
        return res.status(400).send({
          success: false,
          message: "Phone number already exists",
          data: null,
        });
      }
    }

    if (req.body.hasOwnProperty("username")) {
      updateData.username = req.body.username;
      if (
        updateData.username !== user.username &&
        (await Users.findOne({ where: { username: updateData.username } }))
      ) {
        return res.status(400).send({
          success: false,
          message: "Username already exists",
          data: null,
        });
      }
    }

    if (req.body.hasOwnProperty("email")) {
      updateData.email = req.body.email;
      
      if (!isEmail(updateData.email)) {
        return res.status(400).send({
          message: "Please provide a valid email",
          data: null,
        });
      }
      
      if (
        updateData.email !== user.email &&
        (await Users.findOne({ where: { email: updateData.email } }))
      ) {
        return res.status(500).send({
          success: false,
          message: "Email already exists",
          data: null,
        });
      }
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
    const updateProfile = {};

    const user = await Users.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Users not found",
        data: null,
      });
    }

    if (req.body.hasOwnProperty("fullname")) {
      updateProfile.fullname = req.body.fullname;
    }

    if (req.body.hasOwnProperty("address")) {
      updateProfile.address = req.body.address;
    }

    if (req.body.hasOwnProperty("phone")) {
      updateProfile.phone = req.body.phone;
      if (
        updateProfile.phone !== user.phone &&
        (await Users.findOne({ where: { phone: updateProfile.phone } }))
      ) {
        return res.status(400).send({
          success: false,
          message: "Phone number already exists",
          data: null,
        });
      }
    }

    if (req.body.hasOwnProperty("username")) {
      updateProfile.username = req.body.username;
      if (
        updateProfile.username !== user.username &&
        (await Users.findOne({ where: { username: updateProfile.username } }))
      ) {
        return res.status(400).send({
          success: false,
          message: "Username already exists",
          data: null,
        });
      }
    }

    if (req.body.hasOwnProperty("email")) {
      updateProfile.email = req.body.email;
      
      if (!isEmail(updateProfile.email)) {
        return res.status(400).send({
          message: "Please provide a valid email",
          data: null,
        });
      }
      
      if (
        updateProfile.email !== user.email &&
        (await Users.findOne({ where: { email: updateProfile.email } }))
      ) {
        return res.status(500).send({
          success: false,
          message: "Email already exists",
          data: null,
        });
      }
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
