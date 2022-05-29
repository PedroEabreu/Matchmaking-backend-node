const express = require('express')
const router = express.Router()
const { user,contact,service } = require('../models')
const UserService = require('../services/user')

const { body, check, validationResult } = require('express-validator')

const userService = new UserService(user,contact,service)

router.get('/', async (req, res) => {
  const users = await userService.get(req)
  res.status(200).json(users)
})

router.get('/search', async (req, res) => {
  const users = await userService.search(req)
  res.status(200).json(users)
})

router.get('/:id', async (req, res) => {
  const users = await userService.getById(req.params)
  res.status(200).json(users)
})

router.post('/', async (req, res) => {
    try {
      await userService.adicionar(req.body)
      res.status(200).json({message:'Usuário adicionado com sucesso!'})
    } catch (erro) {
      res.status(400).send(erro.message)
    }
})

router.post('/authenticate', async (req, res) => {
    try {
      const user = await userService.authenticate(req.body)
      res.status(201).send(user)
    } catch (erro) {
      res.status(401).send(erro.message)
    }
})

module.exports = router
