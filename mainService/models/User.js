const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        index: true        // fullName için index ekliyoruz
    },
    slides: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slide'
    }],
    email: {
        type: String,
        required: true,
        unique: true,      // email için unique index
        index: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        index: true        // role için index
    },
    tokenCount: {
        type: Number,
        default: 3,
        required: true
    },
    viewedCount: {
        type: Number,
        default: 0
    }
}, { 
    timestamps: true 
});

// Index oluşturma
userSchema.index({ fullName: 1 });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

// Indexleri yeniden oluşturmak için
userSchema.on('index', function(err) {
    if (err) {
        console.error('Index oluşturma hatası:', err);
    } else {
        console.log('Indexler başarıyla oluşturuldu');
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;