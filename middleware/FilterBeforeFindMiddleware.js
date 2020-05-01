
const { ObjectID } = require('mongodb')
const db = require('./../utils/connectDB')
const {isNull,isUndefined} = require('lodash')
const queryObject =async (query) => {
    const queryObj = { ...query }
    const excludeFields = ['page', 'sort', 'limit', 'fields']
    //chi tiết hơn phải lọc lại những chữ cho phép-tìm trong docs như eq,ne,in...
    excludeFields.forEach(el => delete queryObj[el])
    let queryString =await JSON.stringify(queryObj)
    queryString = queryString.replace(/\b(eq|gte|gt|lte|lt|in)\b/g, match => `$${match}`)
    return JSON.parse(queryString)
}
const sort = (query,sort) => {
    //cũng có 4 trường hợp như filterFields chưa làm
    let sortResult
    if (query.sort) {
        const sortArray = query.sort.split(',')
        sortResult = sortArray.reduce((el, value, key) => {
            if (value.indexOf('-') === 0) {
                if( projection.includes(value.slice(1)) )
                el[value.slice(1)] = -1; return el;
            }
            if( projection.includes(value) ) el[value] = 1; return el;
        }, {})

    } else {
        sortResult = { created_at: 1 }
    }
    return sortResult
}

const filterFields = async (fields,user,collectionString,projection) =>{
    //sẽ có 4 trường hợp, 1.là guess và có/ko nhập fields 2.đã đăng nhập và có/ko nhập fields
    if(isUndefined(user)){
        if(isNull(fields)) return projection
        const keys = Object.keys(fields)
        keys.forEach(key => {
            if(!projection.includes(key)) delete fields[key]
        });
        return fields
    }
    const fieldArray =await (await db()).collection('roles').findOne({name:user.role}).fieldable[collectionString]
    if(isNull(fieldArray)) return projection
    const keys = Object.keys(fields)
    keys.forEach(key => {
        if(!fieldArray.includes(key)) delete fields[key]
    });
    // console.log(fields)
    return fields
}

const fields = (query) => {
    //khi có middleware lọc ra những fields người dùng có thể tác động thì chỉ cần lấy xử lý
    let fieldObj
    if (query.fields) {
        const fieldArray = query.fields.split(',')
        fieldObj = fieldArray.reduce((el, value, key) => {
            el[value] = 1; return el;
        }, {})

    } else {
        fieldObj = {}
    }
    return fieldObj
}
exports.fields = fields
const page = (query) => {
    // console.log(queryString)
    let page, limit, skip

    if (query.page) {
        page = parseInt(query.page) || 1
        limit = parseInt(query.limit) || 2
    } else {
        page = 1
        limit = 5
    }
    skip = (page - 1) * limit
    return {
        skip,
        limit
    }
}
const filter = (collectionString,projection,sort)=> async (request, response, next) => {
    const {limit,skip} = page(request.query)
    request.queryObject =await queryObject(request.query),
    // request.fields=fields(request.query),
    request.fields=await filterFields( fields((request.query)),request.user,collectionString,projection ),
    // request.sort=sort(request.query,sort),
    // request.skip=skip,
    // request.limit=limit
    request.allFields = projection
    // console.log(request.queryObject,request.fields,request.sort,request.skip,request.limit)
    // const data = await db.collection(collection).find(queryObject(request.query)).project(fields(request.query)).sort(sort(request.query)).skip(skip).limit(limit).toArray()
    // if (skip>0){
    //     pagination.prev = {page:page-1,limit}
    // }
    // if (skip+limit<total){
    //     pagination.next = {page:page+1,limit}
    // }

    // làm sao để look up trong lúc find ???
    //nếu ko có cách chỉ còn cách lưu tất cả thông tin vào một collection ví dụ như:
    //product có thuộc tính,nhà sản xuất,... thì khi lưu vào product sẽ lưu thêm property:
    //nhà sản xuất:...,thuộc tính:... còn collection thuộc tính, nhà sản xuất sẽ chứa dữ liệu cho validate trước khi CURD
    //khi validate thuộc tính: tìm theo id thì nếu có sẽ gán req.property rồi next cho thằng sau (product) sử dụng để thêm trực tiếp vào collection product
    next()
}
module.exports = filter

