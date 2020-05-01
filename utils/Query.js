
const { ObjectID } = require('mongodb')
const queryObject = (query) => {
    const queryObj = { ...query }
    const excludeFields = ['page', 'sort', 'limit', 'fields']
    //chi tiết hơn phải lọc lại những chữ cho phép-tìm trong docs như eq,ne,in...
    excludeFields.forEach(el => delete queryObj[el])

    let queryString = JSON.stringify(queryObj)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    return JSON.parse(queryString)
}
const sort = (query) => {
    let sortResult = {}
    if (query.sort) {
        if (query.sort.indexOf(',')) {
            const sortArray = query.sort.split(',')
            sortResult = sortArray.reduce((el, value, key) => {
                if (value.indexOf('-') === 0) {
                    el[value.slice(1)] = -1; return el;
                }
                el[value] = 1; return el;
            }, {})
        } else {
            if (query.sort.indexOf('-') === 0) {
                const key = query.sort.slice(1);
                sortResult = {
                    key: -1
                }
            } else {
                const key = query.sort;
                sortResult = {
                    key: 1
                }
            }
        }


    }
    return sortResult
}
const fields = (query) => {
    //khi có middleware lọc ra những fields người dùng có thể tác động thì chỉ cần lấy xử lý
    let fieldObj = {}
    if (query.fields) {
        const fieldArray = query.fields.split(',')
        fieldObj = fieldArray.reduce((el, value, key) => {
            el[value] = 1; return el;
        }, {})

    }
    return fieldObj
}
const page = (query) => {
    // console.log(queryString)
    let page, limit, skip

    if (query.page) {
        page = parseInt(query.page)
        limit = parseInt(query.limit)

        skip = (page - 1) * limit
        return {
            skip,
            limit
        }
    }
    return {}


}
module.exports.fields = (query) => fields(query)
module.exports.Query = (query) => {
    return {
        queryObject: queryObject(query),
        sort: sort(query),
        fields: fields(query),
        page: page(query)
    }
}


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

