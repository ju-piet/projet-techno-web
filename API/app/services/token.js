const jwt = require('jsonwebtoken');
const JWT_PRIVATE_KEY = require("./parameters").JWT_PRIVATE_KEY


const extraireTok = headerValue => {
    if( typeof headerValue !== 'string'){
        return false
    }

    const matches = headerValue.match(/(bearer)\s+(\S+)/i)
    return matches && matches[2]
}

//verification  du tokem
const verifTok = (req, res, next) => {
    //recupÃ©ration du token
    const token = req.headers.authorization && extraireTok(req.headers.authorization)

    //on a pas de token 
    if(!token){
        return res.status(401).json({message: 'il manque le token'})
    }

    //verification du token 
    jwt.verify(token, JWT_PRIVATE_KEY, (err) => {
        console.log(err)
        if(err){
            return res.status(401).json({message: 'mauvais token'})
        } else {

            res.locals.token = jwt.decode(token, JWT_PRIVATE_KEY)

            return next()
        }
    })
};


module.exports = verifTok