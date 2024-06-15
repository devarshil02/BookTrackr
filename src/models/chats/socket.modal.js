const mongoose = require("mongoose");

const socketSchema = mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        socketId: { type: String },
        isConnected: {type: Boolean},
        namespace:{ type: String }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('SocketModal', socketSchema);