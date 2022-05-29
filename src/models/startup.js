const startup = (sequelize, DataTypes) => {
  const Startup = sequelize.define('startup', {
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
    tableName: 'startup',
    timestamps: false
  })

  Startup.associate = function(models) {

     Startup.hasMany(models.service, {
       foreignKey: 'id_usr',
       as: 'services'
     });
  }


  return Startup
}

module.exports = startup
