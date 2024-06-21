const { Travel_Packages, Destinations, Rundowns } = require("../models");

const getAllTravelPackages = async (req, res, _next) => {
  try {
    const packages = await Travel_Packages.findAll({
      include: [
        {
          model: Destinations,
          as: "destinations",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        }, {
          model: Rundowns,
          as: "rundowns",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        }
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (packages.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No travel packages found",
        data: null,
      });
    }

    const formatedPackages = packages.map((package) => {
      return {
        id: package.id,
        title: package.title,
        description: package.description,
        thumbnail: package.thumbnail,
        price: package.price,
        location: package.location,
        duration: package.duration,
        destinations: package.destinations,
        rundowns: package.rundowns,
      };
    });

    return res.status(200).send({
      success: true,
      message: "Travel packages retrieved successfully",
      data: formatedPackages,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

module.exports = { getAllTravelPackages };
