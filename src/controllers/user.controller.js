const { User } = require("../models");

const userList = async (req, res, _next) => {
  try {
    const users = await User.findAll({
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

const userById = async (req, res, _next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: { id },
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    return res.status(200).send({
      success: true,
      message: "User retrieved successfully",
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

module.exports = {
  userList,
  userById,
};
