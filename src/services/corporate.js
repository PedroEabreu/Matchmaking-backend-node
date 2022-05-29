const jwt = require('jsonwebtoken')
const SECRET = "token"
const database = require('../models');
const { sequelize } = require('../models')

const { QueryTypes } = require('sequelize');

class CorporateService {
  constructor () {
  }

  async get (req) {
   
    const options = { attributes: ['id_usr','login', 'name','idt_role','description','st_usr'] }
    options.where = {
      idt_role: "C"
    }
    options.include = [
      {
        model: database.corporate,
        as: 'corporateValues',
        include:[
          {
            model: database.demand,
            as: 'demands'
          }
        ]
      },
      {
        model: database.contact,
        as: 'contacts'
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
        where idt_role <> 'A' and idt_role = 'C'
        and tsv_txt @@ plainto_tsquery('portuguese', '`+req.query.text+`')`, { 
      model: database.usr,
      mapToModel: true })

    return response
  }

  getById(params){
    const options = { attributes: ['id_usr','login', 'name','idt_role','description','st_usr'] }
    options.where = {
      idt_role: "C"
    }
    options.include = [
      {
        model: database.corporate,
        as: 'corporateValues',
        include:[
          {
            model: database.contact,
            as: 'contacts'
          },
          {
            model: database.service,
            as: 'demands'
          }
        ]
      },
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
        const newCorporate = {
          id_usr: newUser.id_usr
        }
        const errors = []

        database.corporate.create(newCorporate).then((newCorporate)=>{
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
  
          userDTO.demands.map(element => {
            const newDemand = {
              description:element.description,
              id_usr: newCorporate.dataValues.id_usr,
              dat_post: new Date(),
              st_demand: 'A'
            }
            try {
                database.demand.create(newDemand)
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
          console.log("ENTROU")
          throw new Error(errors.join());
        }
      })
      if(errors.length>0){
        console.log("ENTROU")
        throw new Error(errors.join());
      }
    }catch(err){
      console.error(err)
    }



      

  }


}

module.exports = CorporateService
