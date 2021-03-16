const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const moment = require('moment');
const fs = require('fs');
const jwtKey = "myKey";
const userValidator = require('../user.modele');
let users = require('../../public/users')

module.exports.signIn_post=(req,res,next)=>{
    const {email} = req.body;
    const uid = uuidv4();
    const timestamp = moment().valueOf();
    const ret = {
        user_id:uid,
        timestamp:timestamp
    }
    /**
     *  générer un token
     * */
    const token = jwt.sign({ ret }, jwtKey, {
        issuer:"test",
        audience:"https://www.test.com",
        algorithm: "HS256",
        expiresIn: 3.154e+8,

    })
    /**
     * on ajoute new user dans fichier /public/users.json
     * */
    const user = {
        token:token,
        user_ip:req.connection.remoteAddress,
        user_id:uid,
        email: email,
        rate: {
            limit:80000,
            timestamp:timestamp,
        },
    }
    /**
     * verification du modele (voir user.modele.js)
     * */
    if (!userValidator.userValidator(user)){
      return res.status(900).end();
    }
    users.push(user);
    fs.writeFile('./public/users.json', JSON.stringify(users), function (err) {
        if (err){
           return res.status(400).end()
        }
    });
    res.cookie("token", token)
    res.status(200).send(token);
    res.end();
}
