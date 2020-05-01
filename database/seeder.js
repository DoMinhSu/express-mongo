const faker = require('faker/locale/vi');
const bcrypt = require('bcryptjs')
const {roles} =require('./../data/roles')
const {categories} =require('./../data/categories')

function roleSeeder(db) {
    db.collection('roles').insertMany(roles)
}
async function userSeeder(db) {
    for (const i of new Array(100)) {
        const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash("123456", salt)
        const user = {
            username: faker.name.findName(),
            email: faker.internet.email(),
            password: password,
            role:faker.random.arrayElement(["admin","manager","author","publisher"])
        }
        db.collection('users').insertOne(user)
    }
}
function categoriesSeeder (db){
    db.collection('categories').insertMany(categories)
}
function productSeeder (db){

    for (const i of new Array(100)) {
        const product = {
            image:faker.image.food(),
            sort_order:0,
            price: faker.commerce.price(),
            status:true,
            image:faker.image.fashion(),
            descriptions: [
                {
                    language:'vi',
                    name:faker.commerce.productName(),
                    description: faker.lorem.paragraphs()
                },
                {
                    language:'en',
                    name:faker.commerce.productName(),
                    description: faker.lorem.paragraphs()
                }
            ]
        }
        db.collection('products').insertOne(product)
    }
}
async function productDeleter(db){
    db.collection('products').drop();
}
async function roleDeleter(db){
    db.collection('roles').drop();
}
async function userDeleter(db){
    db.collection('users').drop();
}
async function categoriesDeleter(db){
    db.collection('categories').drop();
}

module.exports = (db)=>{
    if(process.argv[2] == '-import'){
        roleSeeder(db)
        userSeeder(db)
        categoriesSeeder(db)
        productSeeder(db)
    }
    if(process.argv[2] == '-delete'){
        roleDeleter(db)
        userDeleter(db)
        categoriesDeleter(db)
        productDeleter(db)

    }
}