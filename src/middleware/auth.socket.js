const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const User = require("../models/user.modal");
const makeMongoDbServiceUser = require("../services/db/dbService")({
    model: User,
});
let authNamespace;

module.exports = {
    initializeAuth: function (io) {
        authNamespace = io.of('/auth');
        
        // Define middleware to authenticate incoming connections
        authNamespace.use(async (socket, next) => {
            const bearerToken = socket.handshake.headers.authorization;
            if (!bearerToken) {
                return next(new Error("Authorization token not provided"));
            }

            try {
                const decodedToken = jwt.verify(bearerToken, process.env.API_SECRET);
                const id = decodedToken.id;
                let user = await makeMongoDbServiceUser.getSingleDocumentByQuery({
                    _id: new ObjectId(id),
                });
                if (!user) {
                    return next(new Error("User not found"));
                }

                // Attach the user object to the socket for later use
                socket.user = user;
                next();
            } catch (error) {
                return next(new Error("Invalid or expired token"));
            }
        });

        authNamespace.on('connection', (socket) => {
            console.log('auth namespace WebSocket connection established.');

            // Emit authenticated event once middleware passes
            socket.emit('authenticated', {
                user: socket.user // Access user object attached by middleware
            });

            socket.on('disconnect', () => {
                console.log('WebSocket connection closed from auth namespace');
            });
        });
    }
};

