const { Destinations } = require("../models");

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
      
      const { title, description } = req.body;
      const thumbnail = req.file
        ? `/uploads/thumbnails/${req.file.filename}` : destination.thumbnail;


      if (!destination) {
        return res.status(404).send({
          success: false,
          message: "Destination not found",
          data: null,
        });
      }

      if (title) {
        destination.title = title;
      }

      if (description) {
        destination.description = description;
      }

      if (thumbnail) {
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

module.exports = {
  createDestinations,
  getAllDestinations,
  updateDestination,
};
