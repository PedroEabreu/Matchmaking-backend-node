const express = require('express')

const usersRouter = require('./user')
const startupRouter = require('./startup')
const corporateRounter = require('./corporate')
const positionRounter = require('./position')

//const estudantesRouter = require('./estudantes')

const router = express.Router()

router.get('/', (req, res) => {
  res.send('App online!')
})

router.use('/user', usersRouter)
router.use('/startup', startupRouter)
router.use('/corporate', corporateRounter)
router.use('/position', positionRounter)
//router.use('/estudantes', estudantesRouter)

module.exports = router
