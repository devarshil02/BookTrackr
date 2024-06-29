const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    email: {
        type: String, 
        required: true,
        unique: true,  
    },
    password: {
        type: String,
        required: false,
    },
    profile_avatar: {
        type: String,
        default: null
    },
    user_type: {
        type: Number,
        required: false,  //1 - Admin, 2 - Client 
        default: 2,
        enum: [1, 2]
    },
    isActive: {
        type: Number,
        required: false,  //0 - offline, 1 - online 
        default: 0,
        enum: [0, 1]
    },
}, { 
    timestamps: true,
    versionKey: false
});

const User = mongoose.model('User', userSchema);

module.exports = User;