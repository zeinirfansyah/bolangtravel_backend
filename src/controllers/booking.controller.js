const moment = require("moment");

const { Bookings, Travel_Packages, Users } = require("../models");
const configureMulter = require("../utils/helpers/multer-config");
const uploadThumbnail =
  configureMulter("transfer_receipt").single("transfer_receipt");

const createBooking = async (req, res, _next) => {
  const { date } = req.body;
  const { travel_package_id } = req.query;
  const { id } = req.user;

  const package = await Travel_Packages.findOne({
    where: { id: travel_package_id },
  });
  const user = await Users.findOne({ where: { id } });

  if (!date) {
    return res.status(400).send({
      success: false,
      message: "Date is required",
    });
  }

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

  try {
    const newBooking = await Bookings.create({
      date,
      user_id: id,
      travel_package_id,
    });

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

const getAllBookings = async (req, res, _next) => {
  try {
    const { limit, pages } = req.params;

    const limit_int = parseInt(limit);
    const pages_int = parseInt(pages);

    const offset = (pages_int - 1) * limit_int;

    const bookings = await Bookings.findAndCountAll({
      limit: limit_int,
      offset: offset,
      include: [
        {
          model: Travel_Packages,
          as: "travel_packages",
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
        },
      ],
      attributes: {
        exclude: ["created_at", "updated_at"],
      },
    });

    if (!bookings) {
      return res.status(404).send({
        success: false,
        message: "No bookings found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

const getBookingHistories = async (req, res, _next) => {
  try {
    const { id } = req.user;
    const bookings = await Bookings.findAll({
      where: { user_id: id },
      include: [
        {
          model: Travel_Packages,
          as: "travel_packages",
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
        },
      ],
      attributes: {
        exclude: ["created_at", "updated_at"],
      },
    });

    if (!bookings) {
      return res.status(404).send({
        success: false,
        message: "No bookings found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

const getBookingById = async (req, res, _next) => {
  try {
    const { id } = req.params;

    const booking = await Bookings.findOne({
      where: { id },
      include: [
        {
          model: Travel_Packages,
          as: "travel_packages",
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
        },
      ],
      attributes: {
        exclude: ["created_at", "updated_at"],
      },
    });

    if (!booking) {
      return res.status(404).send({
        success: false,
        message: "No booking found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Booking retrieved successfully",
      data: booking,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

const completeBooking = async (req, res, _next) => {
  try {
    uploadThumbnail(req, res, async (err) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: err.message,
          data: null,
        });
      }

      const { id } = req.params;

      const booking = await Bookings.findOne({ where: { id } });

      if (!booking) {
        return res.status(404).send({
          success: false,
          message: "Booking not found",
        });
      }

      const { bank_name, payer_name } = req.body;
      const transfer_receipt = req.file
        ? `/uploads/transfer_receipt/${req.file.filename}`
        : booking.transfer_receipt;
      const { id: user_id } = req.user;

      if (!bank_name || !payer_name || !transfer_receipt) {
        return res.status(400).send({
          success: false,
          message: "Bank name, payer name, and transfer receipt are required",
        });
      }

      if (booking.user_id !== user_id) {
        return res.status(403).send({
          success: false,
          message: "You are not authorized to complete this booking",
        });
      }

      if (booking.status == "pending") {
        return res.status(403).send({
          success: false,
          message: "Booking is already pending, please wait for confirmation",
        });
      }

      if (booking.status == "paid") {
        return res.status(403).send({
          success: false,
          message: "Booking is already completed",
        });
      }

      if (booking.status == "failed") {
        return res.status(403).send({
          success: false,
          message:
            "You cant complete a failed booking, please contact admin or make a new booking",
        });
      }

      if (booking.transfer_receipt) {
        return res.status(400).send({
          success: false,
          message: "Transfer receipt already uploaded",
        });
      }

      const completedBooking = await booking.update({
        bank_name,
        payer_name,
        transfer_receipt,
        status: "pending",
      });

      return res.status(200).send({
        success: true,
        message: "Payment is success, please wait for confirmation",
        data: completedBooking,
      });
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

module.exports = {
  createBooking,
  completeBooking,
  getAllBookings,
  getBookingHistories,
  getBookingById,
};
