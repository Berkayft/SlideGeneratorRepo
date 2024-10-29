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
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    viewedCount: {
        type: Number,
        default: 0
    },
    imageUrl: { // New field for slide image URL
        type: String,
        required: true, // Set to true if you want this field to be mandatory
        trim: true
    }
});

const SlideModel = mongoose.model('SlideModel', slideSchema);

module.exports = SlideModel;