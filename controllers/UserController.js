const bcrypt = require('bcryptjs')
const { ObjectID } = require('mongodb')
const jwt = require('jsonwebtoken')
const asyncMiddlewareHandler = require('./../utils/AsyncMiddlewareHandler')
exports.create = asyncMiddlewareHandler(async (request, response) => {
    const { db } = request.app.locals

    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(request.body.password, salt)
    const data = {
        username: request.body.username,
        email: request.body.email,
        password: password,
        role: 'author'
    }
    if (request.body.hobbies) data.hobbies = request.body.hobbies
    if (request.body.address) data.address = request.body.address
    const user = await db.collection('users').insertOne(data)
    if(user.insertedCount === 0) return response.status(400).send({  message: "create fail"})
    delete user.ops[0].password  //delete a property in object
    const token = await jwt.sign({
        user: user.ops[0],
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    // const decode = await jwt.verify(token, process.env.JWT_SECRET)
    
    return response.status(200).send({ token: token, message: "created"})
})
exports.read = asyncMiddlewareHandler(async (request, response) => {
    const queryObj = {...request.query}
    const excludeFields = ['page','sort','limit','fields']
    //chi tiết hơn phải lọc lại những chữ cho phép-tìm trong docs như eq,ne,in...
    excludeFields.forEach(el => delete queryObj[el])

    let queryString = JSON.stringify(queryObj)
    queryString = queryString.replace( /\b(gte|gt|lte|lt)\b/g,match => `$${match}`)
    console.log(queryString)


    const { db } = request.app.locals

    const data = await db.collection('users').find(JSON.parse(queryString)).project({password:0}).toArray()
    response.status(200).send({ data: data, message: "read" })


})
exports.readOne = asyncMiddlewareHandler(async (request, response, next) => {
    const { db } = request.app.locals
    //catch bắt chỗ objectID khi truyền quá 24 kí tự sẽ catch-cho phép midddleware sau có tham số err(xử lý tại errorHandler của file app)
    const data = await db.collection('users').findOne({ _id: new ObjectID(request.params.id) }, { projection: { password: 0 } })
    if(data === null ) return response.status(200).send({ message: "not found" })
    response.status(200).send({ data: data, message: "readOne" })
})
exports.update = asyncMiddlewareHandler(async (request, response) => {
    const { db } = request.app.locals
    const { username, email, password, hobbies, addresses } = request.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(request.body.password, salt)
    const data = {}
    if (username) data.username = username
    if (email) data.email = email
    if (password) data.password = hashedPassword
    if (hobbies) data.hobbies = hobbies
    if (addresses) data.addresses = addresses
    const user = await db.collection('users').updateOne({ _id: new ObjectID(request.params.id) }, { $set: data })
    if(user.modifiedCount === 0) return response.status(400).send({ message: "update fail" })
    return response.status(200).send({ message: "updated",user })

})
exports.delete = asyncMiddlewareHandler(async (request, response) => {
    const { db } = request.app.locals
    const data = await db.collection('users').deleteOne({ _id: new ObjectID(request.params.id) })
    if(data.deletedCount === 0) return response.status(400).send({ message: "not found" })
    return response.status(200).send({ message: "deleted",data })

})
