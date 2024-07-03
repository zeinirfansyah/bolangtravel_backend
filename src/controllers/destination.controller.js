const fs = require("fs");
const path = require("path");

const { Destinations,Travel_Packages_Destinations } = require("../models");

const configureMulter = require("../utils/helpers/multer-config");

const uploadThumbnail = configureMulter("thumbnails").single("thumbnail");

const createDestinations = async (req, res, _next) => {
  uploadThumbnail(req, res, async (err) => {
    if (err) {
      return res.status(500).send({
        success: false,
        message: err.message,
        data: null,
      });
    }

    const { title, description } = req.body;
    const thumbnail = req.file
      ? `/uploads/thumbnails/${req.file.filename}`
      : null;

    if (!title) {
      return res.status(400).send({
        success: false,
        message: "Title is required",
        data: null,
      });
    }

    try {
      const newDestination = await Destinations.create({
        title,
        description,
        thumbnail,
      });

      return res.status(200).send({
        success: true,
        message: "Destination created successfully",
        data: newDestination,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: error.message,
        data: null,
      });
    }
  });
};

const updateDestination = async (req, res, _next) => {
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
      const destination = await Destinations.findOne({ where: { id } });

      if (!destination) {
        return res.status(404).send({
          success: false,
          message: "Destination not found",
          data: null,
        });
      }

      const { title, description } = req.body;
      const thumbnail = req.file
        ? `/uploads/thumbnails/${req.file.filename}`
        : destination.thumbnail;

      if (title) {
        destination.title = title;
      }

      if (description) {
        destination.description = description;
      }

      if (thumbnail) {
        if (req.file) {
          const existingThumbnailPath = path.join(
            __dirname,
            `../../public${destination.thumbnail}`
          );
          try {
            fs.unlinkSync(existingThumbnailPath);
          } catch (err) {
            console.error("Error deleting thumbnail:", err);
          }
        }
        destination.thumbnail = thumbnail;
      }

      await destination.update({
        title,
        description,
        thumbnail,
      });

      return res.status(200).send({
        success: true,
        message: "Destination updated successfully",
        data: destination,
      });
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const getAllDestinations = async (req, res, _next) => {
  try {
    const destinations = await Destinations.findAll();

    if (destinations.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No destinations found",
        data: null,
      });
    }

    return res.status(200).send({
      success: true,
      message: "Destinations retrieved successfully",
      data: destinations,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const getDestinationById = async (req, res, _next) => {
  try {
    const { id } = req.params;

    const destination = await Destinations.findOne({ where: { id } });

    if (!destination) {
      return res.status(404).send({
        success: false,
        message: "Destination not found",
        data: null,
      });
    }

    return res.status(200).send({
      success: true,
      message: "Destination retrieved successfully",
      data: destination,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const deleteDestination = async (req, res, _next) => {
  try {
    const { id } = req.params;
    const destination = await Destinations.findOne({ where: { id } });

    if (!destination) {
      return res.status(404).send({
        success: false,
        message: "Destination not found",
        data: null,
      });
    }

    if (destination.thumbnail) {
      const thumbnailPath = path.join(
        __dirname,
        `../../public${destination.thumbnail}`
      );
      try {
        fs.unlinkSync(thumbnailPath);
      } catch (err) {
        console.error("Error deleting thumbnail:", err);
      }
    }

    await Travel_Packages_Destinations.destroy({
      where: { destination_id: id },
    });

    await destination.destroy();

    return res.status(200).send({
      success: true,
      message: "Destination deleted successfully",
      data: null,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: console.error("Error deleting destination:", error),
      data: null,
    });
  }
};

module.exports = {
  createDestinations,
  getAllDestinations,
  updateDestination,
  getDestinationById,
  deleteDestination,
};
