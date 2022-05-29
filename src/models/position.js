const position = (sequelize, DataTypes) => {
  const Position = sequelize.define('position', {
    id_position: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Automatically gets converted to SERIAL for postgres
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'position',
    timestamps: false
  })

  Position.associate = function(models) {
  }

  return Position
}

module.exports = position
