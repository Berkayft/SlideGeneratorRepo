const mongoose = require('mongoose');
const User = require('./User');
const Slide = require('./SlideModel');
require("dotenv").config();

mongoose.connect(process.env.MONGO_API_KEY)
    .then(() => console.log('MongoDB bağlantısı başarılı'))
    .catch((err) => console.error('MongoDB bağlantı hatası:', err));


module.exports = {
    User,
    Slide
};