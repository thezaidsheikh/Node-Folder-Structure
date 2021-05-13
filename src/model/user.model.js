"use strict";

const bcrypt = require("bcrypt");
const constant = require("../constant");

module.exports = (sequelize, DataTypes) => {
  const USER = sequelize.define("user", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scope: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
    mobile: {
      type: DataTypes.STRING,
    },
    login_type: {
      type: DataTypes.INTEGER,
      // defaultValue: constant.SOCIALLOGIN.APPLICATION,
    },
    token: {
      type: DataTypes.TEXT,
    },
    token_expiry: {
      type: DataTypes.DATE,
    },
    dob: {
      type: DataTypes.STRING,
    },
    isLogin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    current_login: {
      type: DataTypes.DATE,
    },
    previous_login: {
      type: DataTypes.DATE,
    },
  });

  USER.beforeCreate((user, options) => {
    if (user.password) {
      return bcrypt
        .hash(user.password, 10)
        .then((hash) => {
          user.password = hash;
        })
        .catch((err) => {
          user.password = "";
          throw new Error(err);
        });
    } else {
      return;
    }
  });
  USER.beforeUpdate((user, options) => {
    console.log("user............in update password...........", user);

    return bcrypt
      .hash(user.password, 10)
      .then((hash) => {
        user.password = hash;
      })
      .catch((err) => {
        throw new Error();
      });
  });
  // USER.associate = (models) => {
  //     USER.hasMany(models.dr_info, {
  //         foreignKey: 'user_id',
  //         as: 'doctor'
  //     });
  //     USER.hasMany(models.pt_info, {
  //         foreignKey: 'user_id',
  //         as: 'patient'
  //     });
  // }
  return USER;
};
