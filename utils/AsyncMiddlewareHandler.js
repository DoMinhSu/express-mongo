const ErrorResponse = require('./ErrorResponse')
//handle try catch in any controller
const asyncHandler = fn => (req, res, next) =>{
  Promise.resolve(fn(req, res, next))
  .catch(next);
}
  

module.exports = asyncHandler;
