const demand = (sequelize, DataTypes) => {
  const Demand = sequelize.define('demand', {
    id_demand: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Automatically gets converted to SERIAL for postgres
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
    },
    tsv_demand:{
      type: DataTypes.TSVECTOR
    },
    id_usr:{
      type: DataTypes.INTEGER
    },
    dat_post:{
      type: DataTypes.DATE
    },
    st_demand:{
      type: DataTypes.ENUM,
        values: ['A', 'I'],
    },
  }, {
    tableName: 'demand',
    timestamps: false
  })

  Demand.associate = function(models) {

     Demand.belongsTo(models.corporate, {
       foreignKey: 'id_usr',
       as: 'user'
     });
  }

  return Demand
}

module.exports = demand
