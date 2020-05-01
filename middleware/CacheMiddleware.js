const cache = require('./../utils/cache')
const cacheMiddleware = (key) => (request, response, next) => {
    if (cache.has(key)){
        response.category = JSON.parse(cache.get(key))
    }
    next()
}
module.exports = cacheMiddleware