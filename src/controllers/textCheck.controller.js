const jwt = require('jsonwebtoken');
const jwtKey = "myKey";
let users = require('../../public/users')
const fs = require('fs');
const moment = require('moment');

module.exports.checkText_post = (req,res,next)=>{
    /**
     * voir signIn.controller.js
     * */
    /**
     * on recupere token si il est dans un cookie ou par bearer token sinon status => 401
     * */
    let token = req.cookies.token;
    if (!token) {
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== "undefined"){
            const bearer = bearerHeader.split(' ');
            token = bearer[1];
        }else{
            return res.status(401).end()
        }
    }
    let payload
    try {
        /**
         * si le token est invalide (s'il a expiré selon l'heure d'expiration que nous avons définie lors de la connexion),
            ou si la signature ne correspond pas
         * **/

        payload = jwt.verify(token, jwtKey)
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            // si l'erreur générée est due au fait que le JWT n'est pas autorisé, renvoie une erreur 401
            return res.status(401).end()
        }
        // sinon, renvoie une erreur de demande incorrecte
        return res.status(400).end()
    }

    let {text} = req.body;

    const user = payload.ret;
    /**
     * text length taper par user
     * */
    const textLength = text.length;
    /**
     *  j'ai stocké les donnees dans fichier local public/user.json, subscribe c pour modifier les donnees si je veux
     * */
    const subscribe=()=>{
        fs.writeFile('./public/users.json', JSON.stringify(users), function (err) {
            if (err){
                return res.status(400).end()
            }
        });
    }
    /**
     * mots par jour d'un user
     * */
    let limit="";

    /***
     * si 24h est depassé
     */
    users.map(obj => [user].find(o => {
            if (o.user_id === obj.user_id){
                if (moment().subtract(24, 'hours').isAfter(obj.rate.timestamp)){
                    obj.rate.timestamp = moment().valueOf();
                    obj.rate.limit = 80000;
                    subscribe();
                }
            }
        })
    );

    /***
     * mots par jour d'un user - text length taper par user
     * est test si on depasse 0 ou text length > mots par jour
     */
    users.map(obj => [user].find(o => {
        if (o.user_id === obj.user_id){
             limit = obj.rate.limit;
             obj.rate.limit = Math.max(0,obj.rate.limit - textLength);
             if (moment().subtract(24, 'hours').isAfter(obj.rate.timestamp)){
                 obj.rate.timestamp = moment().valueOf();
                 obj.rate.limit = 80000;
             }
        }
    })
    );
    if (textLength > limit){
        return res.status(402).end()
    }
    if (limit === 0 ){
        return res.status(402).end();
    }
    subscribe();

    /**
     * si tout a bien fonctionné pour le user on gére son 'request'
     * */
    const lines = text.split('<br/>');

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].length >= 80) {
            let j = 0;
            let space = 80;
            while (j++ >= 80) {
                if (lines[i].charAt(j) === ' ') space = j;
            }
            lines[i + 1] = lines[i].substring(80) + (lines[i + 1] || "");
            lines[i] = lines[i].substring(0, 80);
        }
    }
    text = lines.slice(0, 80).join('<br/>')

    return res.status(200).send(text);

};
