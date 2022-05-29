const contact = (sequelize, DataTypes) => {
  const Contact = sequelize.define('contact', {
    id_contact: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Automatically gets converted to SERIAL for postgres
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
    },
    id_position:{
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    e_mail: {
      type: DataTypes.STRING,
    },
    phone:{
      type: DataTypes.STRING,
    },
    id_user:{
      type: DataTypes.INTEGER
    },
  }, {
    tableName: 'contact'
  })

  Contact.associate = function(models) {

    // Contact.belongsTo(models.startup, {
    //   foreignKey: 'id_user',
    //   as: 'user'
    // });
  }

  return Contact
}

module.exports = contact
