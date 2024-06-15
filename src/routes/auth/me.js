const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const User = require("../../models/user.modal");
const { sendResponse, messages } = require("../../helpers/handleResponse");
const makeMongoDbServiceUser = require("../../services/db/dbService")({
    model: User,
});


exports.handler = async (req, res) => {
    try {
        const bearerToken = req.headers.authorization;
        const token = bearerToken?.toString().split(" ")[1];
        if (token) {
            return jwt.verify(
                token,
                process.env.API_SECRET,
                async (err, decodedToken) => {
                    if (!err) {
                        const id = decodedToken.id;
                        let user = await makeMongoDbServiceUser.getSingleDocumentByQuery({
                            _id: new ObjectId(id),
                        });
                        if (user) {
                            // console.log(user)
                            return sendResponse(res, null, 201, messages.successResponse(user));
                        } else {
                            return res
                                .set({ "Content-Type": "application/json" })
                                .status(401)
                                .send({
                                    isSuccess: false,
                                    status: "UNAUTHORIZED",
                                    message: "You are not authorized to access the request",
                                    data: {},
                                });
                        }
                    } else {
                        return res
                            .set({ "Content-Type": "application/json" })
                            .status(401)
                            .send({
                                isSuccess: false,
                                status: "UNAUTHORIZED",
                                message: "You are not authorized to access the request",
                                data: {},
                            });
                    }
                }
            );
        } else {
            return res
                .set({ "Content-Type": "application/json" })
                .status(401)
                .send({
                    isSuccess: false,
                    status: "UNAUTHORIZED",
                    message: "You are not authorized to access the request",
                    data: {},
                });
        }
    } catch (error) {
        console.error(error);
        return res
            .set({ "Content-Type": "application/json" })
            .status(401)
            .send({
                isSuccess: false,
                status: "UNAUTHORIZED",
                message: "You are not authorized to access the request",
                data: {},
            });
    }
};
