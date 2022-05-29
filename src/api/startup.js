const express = require('express')
const router = express.Router()
const { user,contact,service } = require('../models')
const StartupService = require('../services/startup')

const { body, check, validationResult } = require('express-validator')

const startupService = new StartupService()

router.get('/', async (req, res) => {
  const users = await startupService.get(req)
  res.status(200).json(users)
})

router.get('/search', async (req, res) => {
  const users = await startupService.search(req)
  res.status(200).json(users)
})

router.get('/:id', async (req, res) => {
  const users = await startupService.getById(req.params)
  res.status(200).json(users)
})

router.post('/', async (req, res) => {
    try {
      await startupService.adicionar(req.body)
      res.status(200).json({message:'Usuário adicionado com sucesso!'})
    } catch (erro) {
      res.status(400).send(erro.message)
    }
})

module.exports = router
