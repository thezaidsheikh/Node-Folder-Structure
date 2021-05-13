module.exports = (sequelize, DataTypes) => {
  const refreshToken = sequelize.define("refresh_token", {
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
  refreshToken.associate = function (models) {
    refreshToken.belongsTo(models.user, { foreignKey: "user_id" });
    refreshToken.belongsTo(models.client, { foreignKey: "client_id" });
  };
  return refreshToken;
};
