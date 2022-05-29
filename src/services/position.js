const jwt = require('jsonwebtoken')
const SECRET = "token"
const database = require('../models');

const { sequelize } = require('../models')

class PositionService {
  constructor () {
  }

  async get (req) {
   
    const positions = await database.position.findAll()
    return positions
  }

  getById(params){
    return database.position.findByPk(params.id,options)
  }

  async adicionar (userDTO) {
  }

}

module.exports = PositionService
