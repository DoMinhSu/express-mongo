const jwt = require('jsonwebtoken');
const {ObjectID} = require('mongodb')
const ErrorResponse = require('./../utils/ErrorResponse')
const AsyncMiddlewareHandler =require('./../utils/AsyncMiddlewareHandler')

    exports.jwtAuth=AsyncMiddlewareHandler( async(request,response,next)=> {
        let token
        if(request.headers.authorization 
            // && request.headers.authorization.startsWith('Beerer ') 
        ) token = request.headers.authorization
        else if(request.cookies && request.cookies.token) token = request.cookies.token 
        if(!token) return response.status(401).send({message:'Not Authentication!!'})
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET)
            if(decode) {
                request.user = decode.user
                next() 
            }else
            next(new Error('Not Authentication!!!'))
            // return response.status(401).send({message:'Not authorizations!!'})
        }catch(err){
            // return response.status(401).send({message:'Not authorization!!',err})
            next(new Error('Not Authentication!!!'))
        }
    })
