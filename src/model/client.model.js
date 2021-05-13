module.exports = function (sequalize, DataTypes) {
  let client = sequalize.define("client", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.STRING,
    },
    clientSecret: {
      type: DataTypes.STRING,
    },
  });
  return client;
};
