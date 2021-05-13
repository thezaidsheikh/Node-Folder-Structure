let db = require("../model");

// Create sector management.
const create = async (req, callback) => {
  try {
    console.log("sector controller create req body ====>", req.body);
    let sectorBody = req.body;
    if (sectorBody) {
      let createSector = await db["sector_mngmt"].create(sectorBody);
      return callback(200, {
        message: "Created successfully",
        data: createSector,
      });
    }
    return callback(201, { message: "Name cannot be null" });
  } catch (error) {
    console.log("erro ==>", error);
    callback(500, { data: error, message: "Something went wrong" });
  }
};

// Update sector management.
const update = async (req, callback) => {
  try {
    console.log(
      "sector controller create update body ====>",
      req.body,
      req.params.sectorId
    );
    let sectorBody = req.body;
    let findSector = await db["sector_mngmt"].findOne({
      where: {
        id: req.params.sectorId,
      },
    });
    if (!req.params.sectorId) {
      return callback(404, { message: "Sector id should not be null" });
    }
    if (!findSector) {
      return callback(404, {
        message: "There is no sector found with this id",
      });
    }
    if (sectorBody && req.params.sectorId && findSector) {
      let createSector = await db["sector_mngmt"].update(sectorBody, {
        where: {
          id: req.params.sectorId,
        },
      });
      return callback(200, { message: "Updated successfully" });
    }
    return callback(201, { message: "Name cannot be null" });
  } catch (error) {
    console.log("erro ==>", error);
    callback(500, { data: error, message: "Something went wrong" });
  }
};

// List all sector management.
const listAll = async (req, callback) => {
  try {
    console.log("sector controller list all update ====>");
    let findSector = await db["sector_mngmt"].findAll({
      attributes: ["id", "name"],
    });
    return callback(200, { message: "All sector list", data: findSector });
  } catch (error) {
    console.log("erro ==>", error);
    callback(500, { data: error, message: "Something went wrong" });
  }
};

// Delete sector management.
const deleteSector = async (req, callback) => {
  try {
    console.log("sector controller delete ====>", req.params.sectorId);
    let findSector = await db["sector_mngmt"].findAll({
      attributes: ["id", "name"],
    });
    if (findSector) {
      let deleteSector = await db["sector_mngmt"].destroy({
        where: { id: req.params.sectorId },
      });
      return callback(200, { message: "Sector deleted successfully" });
    }
    return callback(404, { message: "please check your id" });
  } catch (error) {
    console.log("erro ==>", error);
    callback(500, { data: error, message: "Something went wrong" });
  }
};

module.exports = {
  create: create,
  update: update,
  listAll: listAll,
  deleteSector: deleteSector,
};
