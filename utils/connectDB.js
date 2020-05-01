const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');
const asyncHandler = require('./AsyncMiddlewareHandler')
dotenv.config()
const client = new MongoClient(process.env.CONNECTION_URL);
module.exports = async () => {
    try {
        
        const connect = await client.connect()
        const db = await connect.db(process.env.DB_NAME)
        return db
    } catch (error) {
        console.log(error)
    }
}


