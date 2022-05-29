const corporate = (sequelize, DataTypes) => {
  const Corporate = sequelize.define('corporate', {
    id_usr: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Automatically gets converted to SERIAL for postgres
      allowNull: false
    },
    file: {
      type:DataTypes.BLOB   
    }
  }, {
    tableName: 'corporate',
    timestamps: false
  })

  Corporate.associate = function(models) {

     Corporate.hasMany(models.demand, {
      foreignKey: 'id_usr',
      as: 'demands'
     });
  }


  return Corporate
}

module.exports = corporate
