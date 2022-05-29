const jwt = require('jsonwebtoken')
const SECRET = "token"
const database = require('../models');
const { sequelize } = require('../models')

const { QueryTypes } = require('sequelize');

class StartupService {
  constructor () {
  }

  async get (req) {
   
    const options = { attributes: ['id_usr','login', 'name','idt_role','description','st_usr'] }
    options.where = {
      idt_role: "S"
    }
    options.include = [
      {
        model: database.startup,
        as: 'startupValues',
        include:[
          {
            model: database.service,
            as: 'services'
          }
        ]
      },
    ]
    const users = await database.usr.findAll(options)
    return users

  }

  async search(req){
    if(req.query.text == '')
      return this.get()
    const response = await sequelize.query(
      `Select id_usr,name, description,idt_role 
        from usr
        where idt_role <> 'A' and idt_role = 'S'
        and tsv_txt @@ plainto_tsquery('portuguese', '`+req.query.text+`')`, { 
      model: database.usr,
      mapToModel: true })

    return response
  }

  getById(params){
    const options = { attributes: ['id_usr','login', 'name','idt_role','description','st_usr'] }
    options.where = {
      idt_role: "S"
    }
    options.include = [
      {
        model: database.startup,
        as: 'startupValues',
        include:[
          {
            model: database.service,
            as: 'services'
          },
          
        ]
      },
      {
        model: database.contact,
        as: 'contacts'
      }
    ]
    return database.usr.findByPk(params.id,options)
  }

  async adicionar (userDTO) {
    const newUser = {
      login: userDTO.username,
      name: userDTO.name,
      password: userDTO.password,
      idt_role: userDTO.idt_role,
      description: userDTO.description,
      st_usr: userDTO.st_usr
    }
    const user = await database.usr.findOne({
      where: {
        login: newUser.login
      }
    })
    if (user != null) {
      throw new Error('Já existe um user cadastrado com esse nome!')
    }
    
    try{
      await database.usr.create(newUser).then((newUser)=>{
        const newStartup = {
          id_usr: newUser.id_usr
        }
        const errors = []

        database.startup.create(newStartup).then((newStartup)=>{
          userDTO.contacts.map(element => {
            const newContact = {
              name:element.name,
              id_position: element.role,
              e_mail: element.email,
              phone: element.phone,
              id_user: newUser.id_usr
            }
            try {
                database.contact.create(newContact)
            } catch (erro) {
              console.error(erro.message)
              errors.push(erro)
              throw erro
            }
          });
  
          userDTO.services.map(element => {
            const newService = {
              description:element.description,
              item: element.number,
              id_usr: newStartup.dataValues.id_usr
            }
            try {
                database.service.create(newService)
            } catch (erro) {
              errors.push(erro)
              console.error(erro.message)
              throw erro
            }
          });
   
        })
        console.log("error--------------->")
        console.log(errors)
        if(errors.length>0){
          throw new Error(errors.join());
        }
      })
    }catch(err){
      console.error(err)
    }



      

  }

  async authenticate({login,password}){
    const option = {
      attributes: ['id_usr','login', 'name','idt_role','description','st_usr'],
      where: { login: login, password: password }
    }
    const user = await this.user.findOne(option)

    if(user){
       const token = jwt.sign({ userId: user.id_usr},SECRET,{});
       user.dataValues['token'] = token
       return user
    }
    else{
      throw new Error('Usuário não existe')
    }
  }
}

module.exports = StartupService
