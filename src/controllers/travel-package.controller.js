const { where } = require("sequelize");
const { Travel_Packages, Destinations, Rundowns } = require("../models");

const getAllTravelPackages = async (req, res, _next) => {
  try {
    const { limit, pages } = req.params;

    const limit_int = parseInt(limit);
    const pages_int = parseInt(pages);

    const offset = (pages_int - 1) * limit_int;

    const packages = await Travel_Packages.findAndCountAll({
      limit: limit_int,
      offset: offset,
      // include: [
      //   {
      //     model: Destinations,
      //     as: "destinations",
      //     attributes: {
      //       exclude: ["created_at", "updated_at"],
      //     },
      //   },
      //   {
      //     model: Rundowns,
      //     as: "rundowns",
      //     attributes: {
      //       exclude: ["created_at", "updated_at"],
      //     },
      //   },
      // ],
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

    // const formatedPackages = packages.map((package) => {
    //   return {
    //     id: package.id,
    //     title: package.title,
    //     description: package.description,
    //     thumbnail: package.thumbnail,
    //     price: package.price,
    //     location: package.location,
    //     duration: package.duration,
    //     destinations: package.destinations,
    //     rundowns: package.rundowns,
    //   };
    // });

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
   const {id} = req.params;

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

module.exports = { getAllTravelPackages, getTravelPackageById };
