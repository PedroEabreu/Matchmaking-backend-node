const express = require('express')
const router = express.Router()
const CorporateService = require('../services/corporate')

const { body, check, validationResult } = require('express-validator')

const corporateService = new CorporateService()

router.get('/', async (req, res) => {
  const users = await corporateService.get(req)
  res.status(200).json(users)
})

router.get('/search', async (req, res) => {
  const users = await corporateService.search(req)
  res.status(200).json(users)
})

router.get('/:id', async (req, res) => {
  const users = await corporateService.getById(req.params)
  res.status(200).json(users)
})

router.post('/', async (req, res) => {
    try {
      await corporateService.adicionar(req.body)
      res.status(200).json({message:'Usuário adicionado com sucesso!'})
    } catch (erro) {
      res.status(400).send(erro.message)
    }
})

module.exports = router
