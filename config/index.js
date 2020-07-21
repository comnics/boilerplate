// config/index.js
module.exports = (process.env.NODE_ENV === 'production') ? equire('./prod') : require('./dev');