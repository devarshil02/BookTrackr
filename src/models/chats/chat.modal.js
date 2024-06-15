// const mongoose = require('mongoose');

// const chatSchema = new mongoose.Schema({
//     message: {
//         type: String,
//         required: false
//     },
//     senderId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     receiverId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     }
// }, {
//     timestamps: true,
//     versionKey: false
// });

// module.exports = mongoose.model('Chat', chatSchema);


const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
    {
        chatName: { type: String, trim: true },
        isGroupChat: { type: Boolean, default: false },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('Chat', chatSchema);
