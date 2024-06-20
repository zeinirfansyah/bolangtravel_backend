const { User } = require("../models");

const userList = async (res, _next) => {
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

module.exports = {
  userList,
}