const getUser = require("./getUser");
const postChat = require("./postChat");
const getMessages = require("./getChat")
const createGroup = require("./groupChat/createGroup")
const renameGroup = require("./groupChat/renameGroup")
const addToGroup = require("./groupChat/addToGroup")
const removeFromGroup = require("./groupChat/removeFromGroup")
const deleteGroup = require("./groupChat/deleteGroup")
const sendMessage = require("./message/sendMessage")
const getAllMessages = require("./message/getAllMessages")
const socketModal = require("../../models/chats/socket.modal.js");
const ChatModal = require("../../models/chats/chat.modal.js");
const makeMongoDbService = require("../../services/db/dbService.js")({
    model: socketModal,
});

const { authenticateToken } = require("../../middleware/socketAuth");

module.exports = {
    initializeChat: function (io) {
        const chatNamespace = io.of('/chat');

        chatNamespace.use(authenticateToken);

        chatNamespace.on('connection', async (socket) => {
            console.log('chat namespace WebSocket connection established.', socket?.id);

            const loginUser = socket?.user

            if (loginUser) {
                await makeMongoDbService.findOneAndUpdateDocument(
                    { userId: loginUser._id, namespace: 'Chat' },
                    { isConnected: false }
                );

                const socketIdData = await socketModal.findOne({
                    userId: loginUser._id,
                    namespace: 'Chat'
                });

                if (socketIdData) {
                    await makeMongoDbService.findOneAndUpdateDocument(
                        { userId: loginUser._id, namespace: 'Chat' },
                        { isConnected: true, socketId: socket.id }
                    );
                } else {
                    const newSocketData = {
                        userId: loginUser._id,
                        socketId: socket.id,
                        isConnected: true,
                        namespace: 'Chat'
                    };
                    await makeMongoDbService.createDocument(newSocketData);
                }
            }


            let chatId = socket?.handshake?.query?.chatId;
            let chatRoomId = socket?.handshake?.query?.chatId;
            socket.join(chatRoomId);

            socket.on("typing", (chatRoomId) => {
                socket.in(chatRoomId.chatId).emit("typing", { isTyping: true });
            });

            socket.on("stop typing", (chatRoomId) => {
                socket.in(chatRoomId.chatId).emit("stop typing", { isTyping: true });
            });

            // if (loginUser) {
            //     await User.findByIdAndUpdate(loginUser?._id, { isActive: 1 });
            // }
            // socket.broadcast.emit('getOnline', loginUser?._id);

            const getResult = await getUser.handler(loginUser);
            socket.emit('get', getResult);

            // const result = await getMessages.handler(loginUser);
            // socket.emit('getMessages', result);

            const getAlMessages = await getAllMessages.handler(chatId);
            socket.emit('allMessages', getAlMessages);

            socket.join(loginUser?._id);

            socket.on('post', async (data) => {
                const result = await postChat.handler(data, loginUser);
                const resultpost = await getMessages.handler(loginUser);
                socket.emit('post', result);
                const socketData = await makeMongoDbService.getDocumentByQuery(
                    {
                        $and: [
                            { namespace: 'Chat' }, { isConnected: true }, {
                                $or: [
                                    { userId: loginUser._id }, { userId: data?.userId }
                                ]
                            }
                        ]
                    }
                )
                if (socketData) {
                    socketData?.forEach((socketEntry) => {
                        chatNamespace.to(socketEntry?.socketId).emit('getMessages', resultpost);
                    });
                }
            });

            socket.on('groupChat', async (data) => {
                const result = await createGroup.handler(data, loginUser);
                socket.emit('groupChat', result);
            });

            socket.on('sendMessage', async (data) => {
                const result = await sendMessage.handler(data, loginUser);
                const getAlMessages = await getAllMessages.handler(chatId); // this
                socket.emit('sendMessage', result);
                chatNamespace.to(chatRoomId).emit('allMessages', getAlMessages)  //this
                const resultpost = await getMessages.handler(loginUser);
                const chatData = await ChatModal.findById(data?.chatId)
                const otherUsers = chatData?.users?.filter(userId => !userId.equals(loginUser._id));

                const socketData = await makeMongoDbService.getDocumentByQuery(
                    {
                        $and: [
                            { namespace: 'Chat' }, { isConnected: true }, {
                                $or: [
                                    { userId: loginUser._id }, { userId: otherUsers }
                                ]
                            }
                        ]
                    }
                )
                if (socketData) {
                    socketData?.forEach((socketEntry) => {
                        chatNamespace.to(socketEntry?.socketId).emit('getMessages', resultpost);
                    });
                }
            });

            socket.on('renameGroup', async (data) => {
                const result = await renameGroup.handler(data, loginUser);
                socket.emit('renameGroup', result);
            });

            socket.on('addToGroup', async (data) => {
                const result = await addToGroup.handler(data);
                socket.emit('addToGroup', result);
            });

            socket.on('remove', async (data) => {
                const result = await removeFromGroup.handler(data);
                socket.emit('remove', result);
            });

            socket.on('delete', async (data) => {
                const result = await deleteGroup.handler(data, loginUser);
                socket.emit('delete', result);
            });

            socket.on('get', async (data) => {
                const result = await getUser.handler(loginUser, data);
                socket.emit('get', result);
            });

            socket.on('getMessages', async () => {
                const result = await getMessages.handler(loginUser);
                socket.emit('getMessages', result);
            });

            socket.on('disconnect', async () => {
                if (loginUser) {
                    // await User.findByIdAndUpdate(loginUser?._id, { isActive: 0 });
                    await makeMongoDbService.bulkUpdate({ userId: loginUser._id, namespace: 'Chat' }, { isConnected: false });
                }
                // socket.broadcast.emit('getOffline', { userId: loginUser?._id });
                console.log('WebSocket connection closed from chat namespace');
            });
        });
    }
};