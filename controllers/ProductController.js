
const bcrypt = require('bcryptjs')


const jwt = require('jsonwebtoken');
const asyncMiddlewareHandler = require('../utils/AsyncMiddlewareHandler')

const ProductModel = require('../models/ProductModel')
const db = require('../utils/connectDB')
// const d = db.collection('products').find().toArray()
exports.create = asyncMiddlewareHandler(async (request, response) => {
    // console.log(request.file)
    request.body.image = request.file.filename || '' //set ảnh mặc định
    const category = await ProductModel.create(request.body)//validate json middleware
    // if(category.insertedCount === 0) return response.status(400).send({  message: "create fail"})
    return response.status(200).send({ message: "create", category: category })

})
exports.read = asyncMiddlewareHandler(
    async (request, response,next) => {
        const data = await ProductModel.find(request.query)
        return response.status(200).json({
            status:'success',
            data:data
        })

})
exports.popular = asyncMiddlewareHandler(async (request, response, next) => {
    request.query.sort = '-created_at,parent_id'
    request.query.fields = 'parent_id'
    request.query.page = 1
    next()
})
exports.readOne = asyncMiddlewareHandler(async (request, response) => {
    // chỉ check fields ko cần querymiddleware
    // const d = await ProductModel.findById(request.params.id)
    const d = await ProductModel.findById( request.params.id,request.query )

    return response.status(200).send({ message: "readOne", data: d })
})
exports.update = asyncMiddlewareHandler(async (request, response) => {
    // const { db } = request.app.locals
    // const { parent_id, sort_order, status, descriptions } = request.body
    // const data = {}

    // if (parent_id) data.parent_id = parent_id
    // if (sort_order) data.sort_order = sort_order
    // if (status) data.status = status
    // if (descriptions) data.descriptions = descriptions
    // data.updated_at = new Date()

    const category = await ProductModel.updateById(request.params.id, request.body)
    if (category.modifiedCount === 0) return response.status(400).send({ message: "update fail" })
    return response.status(200).send({ message: "update", category })

})
exports.delete = asyncMiddlewareHandler(async (request, response) => {
    const { ids } = request.body
    //if !array ?? 
    await ProductModel.delete(ids)
    // if (data.deletedCount === 0) return response.status(400).send({ message: "not found" })
    return response.status(200).send({ message: "delete" })
})
