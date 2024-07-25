const fs = require("fs");
const path = require("path");

const {
  Travel_Packages,
  Rundowns,
  Destinations,
  Travel_Packages_Destinations,
} = require("../models");

const { uploadFile } = require("../utils/helpers/upload-file");
const { Op } = require("sequelize");

const getAllTravelPackages = async (req, res, _next) => {
  try {
    const { limit, pages } = req.params;
    const { search, category } = req.query;

    const limit_int = parseInt(limit);
    const pages_int = parseInt(pages);

    const offset = (pages_int - 1) * limit_int;

    const searchCondition = search
      ? {
          [Op.or]: [
            { "$travel_packages.title$": { [Op.like]: `%${search}%` } },
            { "$travel_packages.category$": { [Op.like]: `%${search}%` } },
            { "$travel_packages.location$": { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

      const  categoryCondition = category
      ? {
          category: {
            [Op.eq]: category,
          },
        }
      : {};

    const packages = await Travel_Packages.findAndCountAll({
      limit: limit_int,
      offset: offset,
      where: {
        ...searchCondition,
        ...categoryCondition
      },
    });

    if (!packages) {
      return res.status(404).send({
        success: false,
        message: "No travel packages found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Travel packages retrieved successfully",
      data: packages,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

// optional
const getFilteredTravel = async (req, res, _next) => {
  try {
    const { limit, pages, category } = req.params;

    const limit_int = parseInt(limit);
    const pages_int = parseInt(pages);

    const offset = (pages_int - 1) * limit_int;

    const packages = await Travel_Packages.findAndCountAll({
      limit: limit_int,
      offset: offset,
      where: {
        category: category,
      },
    });

    if (!packages) {
      return res.status(404).send({
        success: false,
        message: "No travel packages found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Travel packages retrieved successfully",
      data: packages,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

const getTravelPackageById = async (req, res, _next) => {
  try {
    const { id } = req.params;

    const packages = await Travel_Packages.findOne({
      where: { id },
      include: [
        {
          model: Destinations,
          as: "destinations",
        },
        {
          model: Rundowns,
          as: "rundowns",
        },
      ],
      attributes: {
        exclude: ["created_at", "updated_at"],
      },
    });

    if (!packages) {
      return res.status(404).send({
        success: false,
        message: "No travel packages found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Travel packages retrieved successfully",
      data: packages,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

const createTravelPackage = async (req, res) => {
  const {
    category,
    title,
    description,
    price,
    location,
    duration,
    destinations,
    rundowns,
  } = req.body;

  if (
    !category ||
    !title ||
    !description ||
    !price ||
    !location ||
    !duration ||
    !destinations ||
    !rundowns
  ) {
    return res.status(400).send({
      success: false,
      message: "All fields are required",
    });
  }

  const parsedDestinations = JSON.parse(destinations);
  const parsedRundowns = JSON.parse(rundowns);

  if (!req.files) {
    return res.status(400).send({
      success: false,
      message: "Thumbnail is required",
    });
  }

  const file = req.files.thumbnail;
  const destinationPath = `./public/uploads/thumbnails`;
  const allowedExtensions = [".png", ".jpg", ".jpeg"];

  if (!allowedExtensions.includes(path.extname(file.name))) {
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

    const newTravelPackage = await Travel_Packages.create({
      category,
      title,
      description,
      price,
      location,
      duration,
      thumbnail: link,
    });

    if (parsedDestinations && parsedDestinations.length > 0) {
      for (const destinationId of parsedDestinations) {
        const destination = await Destinations.findByPk(destinationId);

        if (!destination) {
          return res.status(404).send({
            success: false,
            message: `Destination with ID ${destinationId} not found`,
          });
        }

        await Travel_Packages_Destinations.create({
          travel_package_id: newTravelPackage.id,
          destination_id: destinationId,
        });
      }
    }

    if (parsedRundowns && parsedRundowns.length > 0) {
      for (const rundown of parsedRundowns) {
        await Rundowns.create({
          ...rundown,
          travel_package_id: newTravelPackage.id,
        });
      }
    }

    const fullPackage = await Travel_Packages.findByPk(newTravelPackage.id, {
      include: [
        {
          model: Destinations,
          as: "destinations",
        },
        {
          model: Rundowns,
          as: "rundowns",
        },
      ],
    });

    return res.status(201).send({
      success: true,
      message: "Travel package created successfully",
      data: fullPackage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating package" });
  }
};

const deleteTravelPackage = async (req, res, _next) => {
  const { id } = req.params;
  const travel_package = await Travel_Packages.findOne({ where: { id } });

  if (!travel_package) {
    return res.status(404).send({
      success: false,
      message: "Travel package not found",
    });
  }

  try {
    if (travel_package.thumbnail) {
      const thumbnailPath = path.join(
        __dirname,
        `../../public${travel_package.thumbnail}`
      );
      try {
        fs.unlinkSync(thumbnailPath);
      } catch (err) {
        console.error("Error deleting thumbnail:", err);
      }
    }

    await Travel_Packages_Destinations.destroy({
      where: { travel_package_id: id },
    });

    await Rundowns.destroy({
      where: { travel_package_id: id },
    });

    await travel_package.destroy();

    return res.status(200).send({
      success: true,
      message: "Travel package deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: console.error("Error deleting travel_package:", error),
    });
  }
};

const updateTravelPackage = async (req, res, _next) => {
  const { id } = req.params;

  const travel_package = await Travel_Packages.findOne({ where: { id } });

  if (!travel_package) {
    return res.status(404).send({
      success: false,
      message: "Travel package not found",
    });
  }

  const {
    category,
    title,
    description,
    price,
    location,
    duration,
    destinations,
    rundowns,
  } = req.body;

  const thumbnail = req.files?.thumbnail;

  const parsedDestinations = JSON.parse(destinations);
  const parsedRundowns = JSON.parse(rundowns);

  if (
    !category ||
    !title ||
    !description ||
    !price ||
    !location ||
    !duration ||
    !destinations ||
    !rundowns ||
    !thumbnail
  ) {
    return res.status(400).send({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    if (travel_package.thumbnail) {
      const existingThumbnailPath = path.join(
        __dirname,
        `../../public${travel_package.thumbnail}`
      );

      if (fs.existsSync(existingThumbnailPath)) {
        fs.unlinkSync(existingThumbnailPath);
      }
    }

    const file = req.files?.thumbnail;
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

    await travel_package.update({
      category,
      title,
      description,
      price,
      location,
      duration,
      thumbnail: link,
    });

    await Travel_Packages_Destinations.destroy({
      where: { travel_package_id: id },
    });

    await Rundowns.destroy({
      where: { travel_package_id: id },
    });

    if (parsedDestinations && parsedDestinations.length > 0) {
      for (const destinationId of parsedDestinations) {
        const destination = await Destinations.findByPk(destinationId);

        if (!destination) {
          return res.status(404).send({
            success: false,
            message: `Destination with id ${destinationId} not found`,
          });
        }

        await Travel_Packages_Destinations.create({
          travel_package_id: id,
          destination_id: destinationId,
        });
      }
    }

    if (parsedRundowns && parsedRundowns.length > 0) {
      for (const rundown of parsedRundowns) {
        await Rundowns.create({
          ...rundown,
          travel_package_id: id,
        });
      }
    }

    const fullPackage = await Travel_Packages.findByPk(id, {
      include: [
        {
          model: Destinations,
          as: "destinations",
          through: { attributes: [] },
        },
        {
          model: Rundowns,
          as: "rundowns",
        },
      ],
    });

    return res.status(200).send({
      success: true,
      message: "Travel package updated successfully",
      data: fullPackage,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllTravelPackages,
  getTravelPackageById,
  createTravelPackage,
  deleteTravelPackage,
  updateTravelPackage,
  getFilteredTravel,
};
