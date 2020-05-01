const AJV = require("ajv")
const ajv = new AJV({ 
    allErrors: true,
    jsonPointers: true })
// ajv = require('ajv-errors')(ajv);



module.exports = (schema)=> (request,response,next)=>{
    const validate = ajv.compile(schema)
    validate(request.body)
    if(!validate.errors) next()
    else{
        return response.status(400).send({errors:validate.errors})
    }
}