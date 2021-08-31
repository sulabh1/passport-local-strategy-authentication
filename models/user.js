"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isLowercase: true,
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [5, 13],
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.prototype.comparePassword = async function (providedPassword, password) {
    return await bcrypt.compare(providedPassword, password);
  };
  User.addHook("beforeSave", async (user) => {
    const salt = 12;
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
  });
  return User;
};
