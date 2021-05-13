"use strict";

module.exports = (sequelize, DataTypes) => {
  const accessToken = sequelize.define("access_token", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING,
    },
    expire_time: {
      type: DataTypes.DATE,
    },
  });
  accessToken.associate = function (models) {
    accessToken.belongsTo(models.user, { foreignKey: "user_id" });
    accessToken.belongsTo(models.client, { foreignKey: "client_id" });
  };
  return accessToken;
};
