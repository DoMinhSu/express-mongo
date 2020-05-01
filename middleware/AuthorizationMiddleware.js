const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb')
module.exports =(action)=>async (req, res, next) => {
    if (!req.user.role) next(new Error('Not authorization Middleware!!!'))
    const { db } = req.app.locals
    const collection = req.baseUrl.slice(1)
    const collectionRoles =await db.collection('roles').findOne({ name: req.user.role },{projection:{curd:1}})
    if (!collectionRoles.curd[collection] || !collectionRoles.curd[collection].includes(action))
        next(new Error('Not authorization Middleware!!!'))
    next()
}
