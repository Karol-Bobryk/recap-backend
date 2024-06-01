const { DataTypes } = require("sequelize");
const UsersScheme = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gPoints: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  flag: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
};

module.exports = UsersScheme;
