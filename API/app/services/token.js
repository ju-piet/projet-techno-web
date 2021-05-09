const jwt = require('jsonwebtoken');
const JWT_PRIVATE_KEY = require("./parameters").JWT_PRIVATE_KEY


const extraireTok = headerValue => {
    if( typeof headerValue !== 'string'){
        return false
    }

    const matches = headerValue.match(/(bearer)\s+(\S+)/i)
    return matches && matches[2]
}

//verification  du token
const verifTok = (req, res, next) => {
    // Récupération du token
    const token = req.headers.authorization && extraireTok(req.headers.authorization)

    // Si on a pas de token...
    if(!token){
        //... On retourne une requête erreur
        return res.status(401).json({message: 'il manque le token'})
    }

    // Vérification du token 
    jwt.verify(token, JWT_PRIVATE_KEY, (err) => {
        if(err){
            return res.status(401).json({message: 'mauvais token'})
        } else {
            res.locals.token = jwt.decode(token, JWT_PRIVATE_KEY)
            
            return next()
        }
    })
};

module.exports = verifTok