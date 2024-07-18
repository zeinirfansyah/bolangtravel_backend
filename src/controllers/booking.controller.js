const path = require("path");
const fs = require("fs");
const { uploadFile } = require("../utils/helpers/upload-file");

const { Bookings, Travel_Packages, Users } = require("../models");
const { Op } = require("sequelize");

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
    const { search, status } = req.query;

    const limit_int = parseInt(limit);
    const pages_int = parseInt(pages);

    const offset = (pages_int - 1) * limit_int;

    const searchCondition = search
      ? {
          [Op.or]: [
            { "$users.fullname$": { [Op.like]: `%${search}%` } },
            { "$users.username$": { [Op.like]: `%${search}%` } },
            { "$users.phone$": { [Op.like]: `%${search}%` } },
            { "$users.email$": { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const statusCondition = status
      ? {
          status: {
            [Op.eq]: status,
          },
        }
      : {};

    const bookings = await Bookings.findAndCountAll({
      limit: limit_int,
      offset: offset,
      where: {
        ...searchCondition,
        ...statusCondition,
      },
      include: [
        {
          model: Travel_Packages,
          as: "travel_packages",
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
        },
        {
          model: Users,
          as: "users",
          attributes: {
            exclude: ["password", "created_at", "updated_at"],
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
  const { id: booking_id } = req.params;

  const booking = await Bookings.findOne({ where: { id: booking_id } });

  if (!booking) {
    return res.status(404).send({
      success: false,
      message: "Booking not found",
    });
  }

  const { id: user_id } = req.user;

  if (booking.user_id !== user_id) {
    return res.status(403).send({
      success: false,
      message: "You are not authorized to access this booking",
    });
  }

  const { bank_name, payer_name } = req.body;
  const transfer_receipt = req.files?.transfer_receipt;

  if (!bank_name || !payer_name || !transfer_receipt) {
    return res.status(400).send({
      success: false,
      message: "bank_name, payer_name, and transfer_receipt are required",
    });
  }

  if (booking.status === "pending") {
    return res.status(403).send({
      success: false,
      message: "Booking is already pending, please wait for confirmation",
    });
  }

  if (booking.status === "paid") {
    return res.status(400).send({
      success: false,
      message: "Booking is already completed",
    });
  }

  if (booking.status === "failed") {
    return res.status(400).send({
      success: false,
      message:
        "You cant complete a failed booking, please contact admin or make a new booking",
    });
  }

  try {
    if (booking.transfer_receipt) {
      return res.status(400).send({
        success: false,
        message: "Booking is already paid. Please wait for confirmation",
      });
    }

    const file = req.files?.transfer_receipt;
    const transfer_receipt_path = `./public/uploads/transfer_receipt`;
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".pdf"];

    if (!allowedExtensions.includes(path.extname(file.name).toLowerCase())) {
      return res.status(400).send({
        success: false,
        message: "Only PNG, JPG, JPEG, and PDF files are allowed",
      });
    }

    const uploadReceiptPath = await uploadFile(
      file,
      transfer_receipt_path,
      allowedExtensions
    );

    const link = `/uploads/transfer_receipt/${path.basename(
      uploadReceiptPath
    )}`;

    const completedBooking = await booking.update({
      bank_name,
      payer_name,
      transfer_receipt: link,
      status: "pending",
    });

    return res.status(200).send({
      success: true,
      message: "Booking completed successfully",
      data: completedBooking,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

const updateBooking = async (req, res, _next) => {
  const { id: booking_id } = req.params;

  const booking = await Bookings.findOne({ where: { id: booking_id } });

  if (!booking) {
    return res.status(404).send({
      success: false,
      message: "Booking not found",
    });
  }

  const { bank_name, payer_name, status } = req.body;
  const transfer_receipt = req.files?.transfer_receipt;

  try {
    if (bank_name) {
      booking.bank_name = bank_name;
    }

    if (payer_name) {
      booking.payer_name = payer_name;
    }

    if (status) {
      booking.status = status;
    }

    if (transfer_receipt) {
      const file = req.files?.transfer_receipt;
      const destinationPath = `./public/uploads/transfer_receipt`;
      const allowedExtensions = [".png", ".jpg", ".jpeg", ".pdf"];

      if (!allowedExtensions.includes(path.extname(file.name).toLowerCase())) {
        return res.status(400).send({
          success: false,
          message: "Only PNG, JPG, JPEG, and PDF files are allowed",
        });
      }

      const uploadReceiptPath = await uploadFile(
        file,
        destinationPath,
        allowedExtensions
      );

      const link = `/uploads/transfer_receipt/${path.basename(
        uploadReceiptPath
      )}`;

      const existingReceiptPath = path.join(
        __dirname,
        `../../public${booking.transfer_receipt}`
      );

      if (fs.existsSync(existingReceiptPath)) {
        fs.unlinkSync(existingReceiptPath);
      }

      booking.transfer_receipt = link;
    }

    await booking.save();

    return res.status(200).send({
      success: true,
      message: "Booking updated successfully",
      data: booking,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

const deleteBooking = async (req, res, _next) => {
  const { id: booking_id } = req.params;

  const booking = await Bookings.findOne({ where: { id: booking_id } });

  if (!booking) {
    return res.status(404).send({
      success: false,
      message: "Booking not found",
    });
  }

  try {
    if (booking.transfer_receipt) {
      const existingReceiptPath = path.join(
        __dirname,
        `../../public${booking.transfer_receipt}`
      );

      if (fs.existsSync(existingReceiptPath)) {
        fs.unlinkSync(existingReceiptPath);
      }
    }

    await booking.destroy();

    return res.status(200).send({
      success: true,
      message: "Booking deleted successfully",
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
  updateBooking,
  deleteBooking,
};
