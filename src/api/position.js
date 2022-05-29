const express = require('express')
const router = express.Router()

const PositionService = require('../services/position')
const positionService = new PositionService()


router.get('/', async (req, res) => {
  
  const positions = await positionService.get()
  res.status(200).json(positions)
})

module.exports = router
