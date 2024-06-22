const {
  Travel_Packages,
  Destinations,
  Rundowns,
  Travel_Packages_Destinations,
} = require("../models");

const getAllTravelPackages = async (req, res, _next) => {
  try {
    const { limit, pages } = req.params;

    const limit_int = parseInt(limit);
    const pages_int = parseInt(pages);

    const offset = (pages_int - 1) * limit_int;

    const packages = await Travel_Packages.findAndCountAll({
      limit: limit_int,
      offset: offset,

      attributes: {
        exclude: ["created_at", "updated_at"],
      },
    });

    if (packages.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No travel packages found",
        data: null,
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
      message: error.message,
      data: null,
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
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
        },
        {
          model: Rundowns,
          as: "rundowns",
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
        },
      ],
      attributes: {
        exclude: ["created_at", "updated_at"],
      },
    });

    if (packages.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No travel packages found",
        data: null,
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
      message: error.message,
      data: null,
    });
  }
};

const createBundledTravelPackage = async (req, res) => {
  const {
    thumbnail,
    category,
    title,
    description,
    price,
    location,
    duration,
    destinations,
    rundowns,
  } = req.body;

  try {
    const newPackage = await Travel_Packages.create({
      thumbnail,
      category,
      title,
      description,
      price,
      location,
      duration,
    });

    // Create associated destinations
    if (destinations && destinations.length > 0) {
      for (const destination of destinations) {
        const newDestination = await Destinations.create(destination);
        console.log(`New destination created: ${newDestination.id}`);
        await Travel_Packages_Destinations.create({
          travel_package_id: newPackage.id,
          destination_id: newDestination.id,
        });
      }
    }

    // Create associated rundowns
    if (rundowns && rundowns.length > 0) {
      for (const rundown of rundowns) {
        await Rundowns.create({
          ...rundown,
          travel_package_id: newPackage.id,
        });
      }
    }

    // Fetch the new package with its associations
    const createdPackage = await Travel_Packages.findByPk(newPackage.id, {
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

    res.status(201).json({
      success: true,
      message: "Travel package created successfully",
      data: createdPackage,
    });
  } catch (error) {
    console.error("Error creating travel package: ", error);
    res.status(500).json({ error: error.message });
  }
};

const createDestinations = async (req, res, _next) => {
  try {
    const { title, description, thumbnail } = req.body;

    const newDestination = await Destinations.create({
      title,
      description,
      thumbnail,
    });

    if (!title) {
      return res.status(400).send({
        success: false,
        message: "Title is required",
        data: null,
      });
    }

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
};

const createTravelPackage = async (req, res) => {
  try {
    const {
      thumbnail,
      category,
      title,
      description,
      price,
      location,
      duration,
      destinations,
      rundowns,
    } = req.body;

    // Create the Travel Package
    const newPackage = await Travel_Packages.create({
      thumbnail,
      category,
      title,
      description,
      price,
      location,
      duration,
    });

    // Associate destinations with the package
    if (destinations && destinations.length > 0) {
      for (const destinationId of destinations) {
        const destination = await Destinations.findByPk(destinationId);

        if (!destination) {
          return res
            .status(400)
            .json({
              message: `Destination with id ${destinationId} not found`,
            });
        }

        await Travel_Packages_Destinations.create({
          travel_package_id: newPackage.id,
          destination_id: destination.id,
        });
      }
    }

    // Associate rundowns with the package
    if (rundowns && rundowns.length > 0) {
      for (const rundown of rundowns) {
        await Rundowns.create({
          ...rundown,
          travel_package_id: newPackage.id,
        });
      }
    }

    res
      .status(201)
      .json({ message: "Package created successfully!", package: newPackage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating package" });
  }
};

module.exports = {
  getAllTravelPackages,
  getTravelPackageById,
  createDestinations,
  createTravelPackage,
  createBundledTravelPackage,
};
