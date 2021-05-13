module.exports = function (sequalize, DataTypes) {
  let sector_mngmt = sequalize.define("sector_mngmt", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  });
  return sector_mngmt;
};
