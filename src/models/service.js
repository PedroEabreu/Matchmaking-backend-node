const service = (sequelize, DataTypes) => {
  const Service = sequelize.define('service', {
    id_service: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Automatically gets converted to SERIAL for postgres
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
    },
    item:{
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    id_usr:{
      type: DataTypes.INTEGER
    },
  }, {
    tableName: 'service'
  })

  Service.associate = function(models) {

     Service.belongsTo(models.startup, {
       foreignKey: 'id_usr',
       as: 'user'
     });
  }

  return Service
}

module.exports = service
