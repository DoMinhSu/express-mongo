var express = require('express');
var router = express.Router();
const ProductController = require('../controllers/ProductController')
const validationMiddleware = require('../middleware/ValidationMiddleware')
const isAuth = require('../middleware/AuthMiddleware')
const authorization = require('../middleware/AuthorizationMiddleware')
const createSchema = require('../json/product/create')
const updateSchema = require('../json/product/update')
const {queryResults,queryResult} = require('../utils/Query')
const filter = require('../middleware/FilterBeforeFindMiddleware')
const cacheMiddleware = require('../middleware/CacheMiddleware')
const reponse = require('../middleware/ResponseMiddleware')
const {uploadImageSingle} = require('./../utils/upload')
const {resizeImageMiddleware} = require('./../middleware/ResizeImageMiddleware')

const {uploadImageSingleAndResize} = require('./../utils/uploadAndResize')
// router.use(isAuth.jwtAuth)

router.route('/')
        .get(
                // authorization('read'),
                // queryResults('categories'),

                // filter('categories',['_id','parent_id','status','descriptions','sort_order'],['sort_order','-parent_id']),//guess-user :projection,sort,page,limit,
                // cacheMiddleware('categories'),
                
                ProductController.read,
                
                // reponse
        )
        .post(
                // authorization('create'),

                // validationMiddleware(createSchema),

                // uploadImageSingle,

                uploadImageSingleAndResize,
                resizeImageMiddleware,
                ProductController.create,

        )
        .delete(
                // authorization('delete'),
                ProductController.delete
        )
router.route('/:id')
        .get(
                // authorization('readOne'),
                // queryResult('categories'),
                ProductController.readOne
        )
        .put(
                // authorization('update'),
                // validationMiddleware(updateSchema),
                ProductController.update
        )

// router.get('/popular',
//         ProductController.popular,
//         ProductController.read
// )
module.exports = router;
