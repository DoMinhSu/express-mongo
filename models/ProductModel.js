
const { ObjectID } = require('mongodb')
const dbFunction = require('../utils/connectDB')
const cache = require('../utils/cache')

const asyncHandler = require('../utils/AsyncMiddlewareHandler')
const {fields,Query} = require('./../utils/Query')

class Product {
    // static async find(queryObject,fields,sort,skip,limit,cacheKey) {
    static async find(queryRequest) {
        const db = await dbFunction()
        const query = Query(queryRequest)
        console.log(query)
        const data = await db.collection("products").find(query.queryObject || {},{projection:query.fields || {}}).limit(query.page.limit || 10).skip(query.page.skip || 0).sort(query.sort || {}).toArray()
        // cache.set(cacheKey, JSON.stringify(data))
        return data
    }
    static async findById(idString, queryRequest) {
        const db = await dbFunction()
        const projection = fields(queryRequest)

        const a = await db.collection('products').findOne({ _id: new ObjectID(idString) }, {projection})
        return a
    }
    static async create(requestBodyJson) {
        const db = await dbFunction()
        requestBodyJson.created_at = new Date()
        requestBodyJson.updated_at = new Date()

        //mặc định hàm này sẽ cho phép thêm vào các trường có thể có ở trong collection-validate dạng có thể có hoặc ko
        //nhưng sẽ qua thêm 1 bộ lọc những trường đươch tác động dựa vào csdl 
        const category =await db.collection('products').insertOne(requestBodyJson)
        return category.ops[0]
    }
    static async updateById(idString, requestBodyJson) {
        const db = await dbFunction()
        requestBodyJson.updated_at = new Date()

        const category = await db.collection('products').updateOne({ _id: new ObjectID(idString) }, { $set: requestBodyJson })
        return category
    }
    static async delete(idsArray) {

        idsArray.forEach(async (id) => {
            await db.collection('products').deleteOne({ _id: new ObjectID(id) })
        });
    }
}


// const a =asyncHandler(async (idString, projectionJson)=>{
//     const a = await (await db()).collection('products').findOne({ _id: new ObjectID(idString) }, {
//         // projection : projectionJson
//     })
//     return a
// })

module.exports = Product