exports.roles=  [
    {
        name: 'admin',
        fieldable: {},
        //colelction_name:[...fields in collection]
        //dùng chữ users/ trên url để check trong mảng này lọc lại field cần hiển thị với mỗi loại người dùng
        //sử dụng function hợp lý với mỗi người dùng: dựa vào quyền ví dụ: admin: a['getItem'+'Admin']() với admin là lấy từ req.user.role
        curd:{
            categories:['create','update','read','readOne','delete'],
            users:['create','update','read','readOne','delete']
        }
    },
    {
        name: 'manager',
        fieldable: {
            users:['password']
        },
        curd:{
            categories:['create','update','read','readOne','delete'],
            users:['create','read','readOne','delete']
        }
    },
    {
        name: 'author',
        fieldable: {
            users:['role', 'password', 'isPublish', 'isActive']
        },
        curd:{
            categories:['read','readOne'],
            users:['read','readOne']
        }
    },
    {
        name: 'publisher',
        fieldable:{
            users:['role', 'password']
        },
        curd:{
            categories:['update','read','readOne']
        }
    },
]