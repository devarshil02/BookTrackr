// auth.middleware.js
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const User = require("../models/user.modal");
const makeMongoDbServiceUser = require("../services/db/dbService")({
    model: User,
});

async function authenticateToken(socket, next) {
    const bearerToken = socket.handshake.headers.authorization;
    if (!bearerToken) {
        socket.emit('authorization_error', { message: "Authorization token not provided" });
        return next(new Error("Authorization token not provided"));
    }

    try {
        const decodedToken = jwt.verify(bearerToken, process.env.API_SECRET);
        const id = decodedToken.id;
        const user = await makeMongoDbServiceUser.getSingleDocumentByQuery({
            _id: new ObjectId(id),
        });
        if (!user) {
            const error = new Error("You are not authorized to access the request");
            error.name = "UnauthorizedError";
            error.status = 401; // HTTP status code for Unauthorized
            error.isSuccess = false;
            throw error;
        }

        // Attach the user object to the socket for later use
        socket.user = user;
        next();
    } catch (error) {
        console.log(error)
        return next(new Error("Invalid or expired token"));
    }
}

module.exports = {
    authenticateToken
};
