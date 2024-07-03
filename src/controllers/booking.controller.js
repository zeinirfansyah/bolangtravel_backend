const { Bookings, Travel_Packages, Users } = require("../models");

const createBooking = async (req, res, _next) => {
  const { date } = req.body;
  const { travel_package_id } = req.query;
  const { id } = req.user;

  try {
    if (!date) {
      return res.status(400).send({
        success: false,
        message: "Date is required",
      });
    }

    const package = await Travel_Packages.findOne({
      where: { id: travel_package_id },
    });

    const user = await Users.findOne({ where: { id } });

    if (!package) {
      return res.status(404).send({
        success: false,
        message: "Travel package not found",
      });
    }

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const newBooking = await Bookings.create({
      date,
      user_id: id,
      travel_package_id,
    });

    if (!newBooking) {
      return res.status(500).send({
        success: false,
        message: "Error creating booking",
      });
    }

    return res.status(201).send({
      success: true,
      message: "Booking created successfully",
      data: newBooking,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

module.exports = { createBooking };
