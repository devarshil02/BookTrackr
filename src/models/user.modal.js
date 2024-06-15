const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,  
    },
    password: {
        type: String,
        required: true,
    },
    profile_avatar: {
        type: String,
        default: null
    },
    user_type: {
        type: Number,
        required: true,  //1 - Admin, 2 - Client 
        default: 2,
        enum: [1, 2]
    },
    isActive: {
        type: Number,
        required: true,  //0 - offline, 1 - online 
        default: 0,
        enum: [0, 1]
    },
}, { 
    timestamps: true,
    versionKey: false
});

const User = mongoose.model('User', userSchema);

module.exports = User;