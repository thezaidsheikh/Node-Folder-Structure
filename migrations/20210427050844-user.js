'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

     return queryInterface.createTable(
      'users',
      {

        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV1,
          primaryKey: true
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,

        },
        scope: {
          type: Sequelize.STRING
        },
        role: {
          type: Sequelize.STRING
        },
        name: {
          type: Sequelize.STRING,
        },
        username: {
          type: Sequelize.STRING,
        },
        mobile: {
          type: Sequelize.STRING,
        },
        login_type: {
          type: Sequelize.INTEGER,
          // defaultValue: constant.SOCIALLOGIN.APPLICATION,
        },
        token: {
          type: Sequelize.STRING,
        },
        token_expiry: {
          type: Sequelize.DATE,
        },
        dob: {
          type: Sequelize.STRING,
        },
        updatedAt: {
          type: Sequelize.DATE
        },
        createdAt: {
          type: Sequelize.DATE
        },
        isLogin: {
          type: Sequelize.BOOLEAN,
          defaultValue:false
        },
        current_login: {
          type: Sequelize.DATE
        },
        previous_login: {
          type: Sequelize.DATE
        }
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
