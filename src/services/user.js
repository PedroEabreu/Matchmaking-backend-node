const jwt = require('jsonwebtoken')
const SECRET = "token"
//import database from '../models';
//const { db } = require('../models')
const database = require('../models');

const { sequelize } = require('../models')


//import database from '../../api/server/src/models';


const { QueryTypes } = require('sequelize');

class UsersService {
  constructor () {
  }

  async get (req) {
   
    const options = { attributes: ['id_usr','login', 'name','idt_role','description','st_usr'] }

    options.include = [

    ]
    console.log(database)
    const users = await database.usr.findAll(options)
    return users
  }

  async search(req){
    if(req.query.text == '')
      return this.get()
    const response = await sequelize.query(
      `Select id_usr,name, description,idt_role 
        from usr
        where idt_role <> 'A'
        and tsv_txt @@ plainto_tsquery('portuguese', '`+req.query.text+`')`, { 
      model: this.user,
      mapToModel: true })

    return response
  }

  getById(params){
    const options = { attributes: ['id_usr','login', 'name','idt_role','description','st_usr'] }

    return database.usr.findByPk(params.id,options)
  }

  async adicionar (userDTO) {
    // verifica se já existe user com o mesmo nome
    //console.log(userDTO)
    console.log(userDTO)
    const newUser = {
      login: userDTO.username,
      name: userDTO.name,
      password: userDTO.password,
      idt_role: userDTO.idt_role,
      description: userDTO.description,
      st_usr: userDTO.st_usr
    }
    console.log(newUser)
    const user = await database.usr.findOne({
      where: {
        login: newUser.login
      }
    })
    if (user != null) {
      throw new Error('Já existe um user cadastrado com esse nome!')
    }
    try {
      await this.user.create(newUser).then((newUser)=>{
        console.log(newUser)
        userDTO.contacts.map(element => {
          const newContact = {
            name:element.name,
            id_position: element.role,
            e_mail: element.email,
            phone: element.phone,
            id_user: newUser.dataValues.id_usr
          }
          try {
            this.contact.create(newContact)
          } catch (erro) {
            console.error(erro.message)
            throw erro
          }
        });

        userDTO.services.map(element => {
          const newService = {
            description:element.description,
            item: element.number,
            id_usr: newUser.dataValues.id_usr

          }
          try {
            this.service.create(newService)
          } catch (erro) {
            console.error(erro.message)
            throw erro
          }
        });
 
        
      })
    } catch (erro) {
      console.error(erro.message)
      throw erro
    }

      

  }

  async authenticate({login,password}){
    const option = {
      attributes: ['id_usr','login', 'name','idt_role','description','st_usr'],
      where: { login: login, password: password }
    }
    console.log("ENTROU")
    let user
    try{
       user = await database.usr.findOne(option)
    }catch(err){
      console.log(err)
    }
    console.log(user)
    if(user){
      console.log("entrou",user)
       const token = jwt.sign({ userId: user.id_usr},SECRET,{});
       user.dataValues['token'] = token
       return user
    }
    else{
      throw new Error('Usuário não existe')
    }
  }
}

module.exports = UsersService
