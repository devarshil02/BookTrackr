const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
    {
        url: { type: String, required: true },
        type: { type: String, required: true },
        name: { type: String, required: false },
    },
    {
        _id: false,
    }
);

const messageSchema = mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String, trim: true },
        chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
        readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        attachments: [attachmentSchema],
    },
    {
        timestamps: true,
        versionKey: false
    }
);
module.exports = mongoose.model('Message', messageSchema);