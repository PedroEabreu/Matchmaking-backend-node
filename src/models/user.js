const usr = (sequelize, DataTypes) => {
  const Usr = sequelize.define('usr', {
    id_usr: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Automatically gets converted to SERIAL for postgres
      allowNull: false
    },
    login: {
      type: DataTypes.STRING,
      unique:true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
    },
    password:{
      allowNull: false,
      type: DataTypes.STRING,
    },
    idt_role:{
      type: DataTypes.ENUM,
        values: ['A', 'C', 'S'],
    },
    description:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    tsv_txt:{
      type: DataTypes.TSVECTOR
    },
    st_usr:{
      type: DataTypes.ENUM,
      values: ['P', 'A'],
    },
  }, {
    tableName: 'usr'
  })

  Usr.associate = function(models) {

    Usr.hasOne(models.startup, {
      foreignKey: 'id_usr',
      as: 'startupValues'
    });    
    
    Usr.hasOne(models.corporate, {
      foreignKey: 'id_usr',
      as: 'corporateValues'
    });

    Usr.hasMany(models.contact, {
      foreignKey: 'id_user',
      as: 'contacts'
    });


  }


  return Usr
}

module.exports = usr
