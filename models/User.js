const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    slides: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slide'
    }],
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
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
        required: true
    }
});


const User = mongoose.model('User', userSchema);

module.exports = User;