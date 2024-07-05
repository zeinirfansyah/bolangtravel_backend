const fs = require("fs");
const path = require("path");

const { Destinations, Travel_Packages_Destinations } = require("../models");

const { uploadFile } = require("../utils/helpers/upload-file");


const createDestinations = async (req, res, _next) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).send({
      success: false,
      message: "title is required",
    });
  }

  if (!req.files) {
    return res.status(400).send({
      success: false,
      message: "thumbnail is required",
    });
  }

  const file = req.files.thumbnail;
  const destinationPath = `./public/uploads/thumbnails`;
  const allowedExtensions = [".png", ".jpg", ".jpeg"];

  if (!allowedExtensions.includes(path.extname(file.name).toLowerCase())) {
    return res.status(400).send({
      success: false,
      message: "Invalid file type. Only png, jpg, and jpeg files are allowed.",
    });
  }

  try {
    const uploadThumbnailPath = await uploadFile(
      file,
      destinationPath,
      allowedExtensions
    );
    const link = `/uploads/thumbnails/${path.basename(uploadThumbnailPath)}`;

    const newDestination = await Destinations.create({
      title,
      description,
      thumbnail: link,
    });

    return res.status(201).send({
      success: true,
      message: "Destination created successfully",
      data: newDestination,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Error while uploading file: ${error.message}`,
    });
  }
};

const updateDestination = async (req, res, _next) => {
  const { id } = req.params;

  const destination = await Destinations.findOne({ where: { id } });

  if (!destination) {
    return res.status(404).send({
      success: false,
      message: "Destination not found",
    });
  }

  const { title, description } = req.body;
  const thumbnail = req.files;

  try {
    if (title) {
      destination.title = title;
    }

    if (description) {
      destination.description = description;
    }

    if (thumbnail) {
      const file = req.files.thumbnail;
      const destinationPath = `./public/uploads/thumbnails`;
      const allowedExtensions = [".png", ".jpg", ".jpeg"];

      if (!allowedExtensions.includes(path.extname(file.name).toLowerCase())) {
        return res.status(400).send({
          success: false,
          message:
            "Invalid file type. Only png, jpg, and jpeg files are allowed.",
        });
      }

      const uploadThumbnailPath = await uploadFile(
        file,
        destinationPath,
        allowedExtensions
      );

      const link = `/uploads/thumbnails/${path.basename(uploadThumbnailPath)}`;

      const existingThumbnailPath = path.join(
        __dirname,
        `../../public${destination.thumbnail}`
      );

      if (fs.existsSync(existingThumbnailPath)) {
        fs.unlinkSync(existingThumbnailPath);
      }

      destination.thumbnail = link;
    }

    await destination.save();

    return res.status(200).send({
      success: true,
      message: "Destination updated successfully",
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

const getAllDestinations = async (req, res, _next) => {
  try {
    const destinations = await Destinations.findAll();

    if (!destinations) {
      return res.status(404).send({
        success: false,
        message: "No destinations found",
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
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: console.error("Error deleting destination:", error),
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
