const Roles = require("../models/RoleModel")
const Users = require("../models/UserModel")
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys')

class UserController {
    static createUser(){
        return async (request, response, next)=>{
            const { username,telephone, email,password} = request.body
            if(!username || !telephone || !email || !password){
                return response.status(422).json({
                    error: "Veuillez saisir tout les champs"
                })
            }
            const user = new Users({username,telephone, email,password})
            await user.save()
            .then((doc)=>{
                if(doc){
                    response.status(201).json({
                        message: "created user",
                        user: doc
                    })
                }
            })
            .catch((error)=>{
                console.log(error)
            })
        }
    }
    static getUser(){
        return async (request, response, next)=>{
           Users.find()
           .populate('id_role', "_id label")
           .exec()
           .then((users)=>{
               if(users){
                    response.status(200).json({
                        taille: users.length,
                        users: users
                    })
               }
           })
           .catch((error)=>{
               console.log(error)
           })
        }
    }
    static createRole(){
        return async (request, response, next)=>{
            const { label } = request.body
            if(!label){
                return response.status(422).json({
                    error: "Veuillez saisir tout les champs"
                })
            }
            const role = new Roles({label})            
            await role.save()
            .then((doc)=>{
                if(doc){
                    response.status(201).json({
                        message: "Created role",
                        role: doc
                    })
                }
            })
            .catch((error)=>{
                console.log(error)
            })
        }
    }
    static login(){
      return async(request, response, next)=>{
        const { username, password } = request.body
        if(!username || !password){
            response.status(422).json({error: "please add nom or password"})
        }
        await Users.findOne({username: username})
        .then((savedUser)=>{
            if(!savedUser){
                return response.status(422).json({error: "Invalid nom or password"})
            }
            Users.findOne({password: password})
            .then((password)=>{
                if(!password){
                    return response.status(422).json({Error: "Invalid nom or password"})
                }else{
                    const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
                    const {_id, telephone, email, username} = savedUser
                    response.send({token, user: {_id, telephone, email, username}})
                }
            })
            .catch((error)=>{
                console.log(error)
            })
        })
        .catch(error=>{
            response.json({Error: error})
        })
      }
   }
}

module.exports = UserController
