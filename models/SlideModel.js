const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
    filepath: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        trim: true,
        default: 'Untitled Slide'
    },
    isPublic: {
        type: Boolean,
        default: false
    }
});

const SlideModel = mongoose.model('SlideModel', slideSchema);

module.exports = SlideModel;