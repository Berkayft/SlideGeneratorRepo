const mongoose = require('mongoose');
const User = require('./User');
const SlideModel = require("./SlideModel");
require("dotenv").config();

mongoose.connect(process.env.MONGO_API_KEY || 'mongodb://localhost/your_database')
    .then(async () => {
        console.log('MongoDB bağlantısı başarılı');
        
        try {
            // Mevcut indexleri kontrol et ve senkronize et
            await User.syncIndexes();
            console.log('Indexler senkronize edildi');
        } catch (err) {
            console.error('Index senkronizasyon hatası:', err);
        }
    })
    .catch(err => console.error('MongoDB bağlantı hatası:', err));

module.exports = {
    User,
    SlideModel
};