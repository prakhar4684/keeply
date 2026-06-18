const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim:true
    },
    password: {
        type: String,
        required: true
    },
    storageLimit: {
        type: Number,
        default: 5368709120
    },
    usedStorage: {
        type: Number,
        default: 0

    },
    plan: {
        type: String,
        enum: ["FREE", "PRO", "PREMIUM"],
        default: "FREE"
    },
    isDeleted: {
        type: Boolean,
        default: false
    },


    deletedAt: {
        type: Date,
        default: null
    }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
