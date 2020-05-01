const sift = require('sift')
const {pick} = require('lodash');
const {descend,ascend,sortWith,prop} = require('ramda');
module.exports = (request, response) => {
    let data = response.category
    //lọc dữ liệu 
    //by criteria
    data = data.filter(
        sift(request.queryObject)
    );

    //by fields
    let fields = Object.keys(request.fields)

    data = data.map((item) => {
        return pick(item,fields)
    })
    //by sort
    let sortParam = []
    const sortRequest = request.sort
    for (const key in sortRequest) {
        if(sortRequest === 1) sortParam.push(descend(prop(key)))
        if(sortRequest === -1) sortParam.push(ascend(prop(key)))
    }
    data = sortWith(sortParam)(data);
    //page  :limit  -   skip(vị trí trong arr)
    //1     :5      -   0
    //2     :5      -   limit*(page-1)              =>data = data.slice(limit*(page-1)-1,limit)


    //khi create lấy cache ra dùng hàm push của arr or insert của ramda thêm vào 1 vị trí
    //update: dùng hàm update của ramda
    //delete: hàm remove của ramda
    return response.status(200).json({ data })
}