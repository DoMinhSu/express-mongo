var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const createSchema = require('./../json/user/create')
const updateSchema = require('./../json/user/update')
const validationMiddleware = require('./../middleware/ValidationMiddleware')
const isAuth = require('./../middleware/AuthMiddleware')
const authorization = require('./../middleware/AuthorizationMiddleware')
// router.use(isAuth.jwtAuth)
router.route('/')
        .get(
                // authorization('read'),
                userController.read
        )
        .post(
                // authorization('create'),
                // validationMiddleware(createSchema),
                userController.create
        )
        .delete(
                // authorization('delete'),
                userController.delete
        )
router.route('/:id')
        .get(
                // authorization('readOne'),
                userController.readOne
        )
        .put(
                // authorization('update'),
                // validationMiddleware(updateSchema), 
                userController.update
        )
        .delete(
                // authorization('delete'),
                userController.delete
        )

module.exports = router;
