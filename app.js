var express = require('express');
var bodyParser = require('body-parser')
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/UserRoutes');
var ProductRouter = require('./routes/ProductRoutes');
var authRouter = require('./routes/AuthRoutes');
const FileRouter = require('./routes/FileRoutes')
// var errorHandler = require('./middleware/ErrorMiddleware');
var app = express();
const dotenv = require('dotenv');
const seeder = require('./database/seeder')
const ErrorResponse = require('./utils/ErrorResponse')
dotenv.config()
const MongoClient = require('mongodb').MongoClient;


let db
const client = new MongoClient(process.env.CONNECTION_URL);


client.connect(function (err) {
   db = client.db(process.env.DB_NAME);
  app.locals.db = db
  seeder(db)
});

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
app.use(express.json());
// app.use(bodyParser.json({ type: 'application/*+json' }))


// app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


//route sẽ đi từ đầu đến cuối cho dù có return bên trong controller cũng ko có tác dụng
//return ko có ý nghĩa trong controller
//vào route->Controller->route khác->controller khác->... nếu ko có err thì sẽ ko vào các route có tham số là err
app.use('/', indexRouter);
app.use('/auth',authRouter)
app.use('/users', usersRouter);
app.use('/products', ProductRouter);
app.use('/files',FileRouter)


//bắt lỗi
app.use((err, req, res, next)=> {
  return res.status(err.statusCode || 500).json({
     status: err.status,
     statusCode:err.statusCode,
     message: err.message ,
     name:err.name || '',
     stack :err.stack
 })
});

// //handle route not found, dùng cho mvc
// app.use((req,res,next)=>{
//   return res.status(404).json({
//     status:'fail',
//   })
// });
module.exports = app;
