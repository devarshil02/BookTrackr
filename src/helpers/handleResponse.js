const sendResponse = (response, headers = null, status, data) => {
    if (headers && headers !== '') {
        return response.set(headers).status(status).send(data);
    }
    return response.set({ "Content-Type": "application/json" }).status(status).send(data);
};

const sendSocketResponse = (data, meta, status = 'SUCCESS', message = 'Your request is successfully executed') => {
    return { status,isSuccess: true, data, meta, message };
};

const sendSocketBadResponse = (data, status = 'FAILURE', message = 'Internal Server Error') => {
    return { status,isSuccess: false, data: {}, message };
};

const sendSocketbadRequest = (data, status = 'BAD_REQUEST', message = 'The request cannot be fulfilled due to bad syntax') => {
    return { status,isSuccess: false, data: {}, message };
};

let messages = {}
messages.successResponse = (data = [], meta = {}) => ({
    isSuccess: true,
    status: 'SUCCESS',
    message: 'Your request is successfully executed',
    data,
    meta
});
messages.failureResponse = (data) => ({
    isSuccess: false,
    status: 'FAILURE',
    message: 'Internal Server Error',
    data: {}
});
messages.badRequest = (data) => ({
    isSuccess: false,
    status: 'BAD_REQUEST',
    message: 'The request cannot be fulfilled due to bad syntax',
    data: {}
});

messages.isDuplicate = (data) => ({
    isSuccess: false,
    status: 'VALIDATION_ERROR',
    message: 'Data duplication Found',
    data: {}
});

messages.isAssociated = (data = {}) => ({
    isSuccess: false,
    status: 'CONFLICT',
    message: 'Authentication data are already associated with another account.',
    data
});

messages.recordNotFound = (data = {}) => ({
    isSuccess: false,
    status: 'RECORD_NOT_FOUND',
    message: 'Record not found with that criteria.',
    data
});

messages.recordNotFound = (data = {}) => ({
    isSuccess: false,
    status: 'RECORD_NOT_FOUND',
    message: 'Record not found with that criteria.',
    data
});

messages.recordDoseNotExist = (data = {}) => ({
    isSuccess: false,
    status: 'RECORD_NOT_FOUND',
    message: "Incorrect email or password",
    data
});

messages.insufficientParameters = () => ({
    isSuccess: false,
    status: 'BAD_REQUEST',
    message: 'Insufficient parameters',
    data: {}
});

messages.mongoError = (error) => ({
    isSuccess: false,
    status: 'FAILURE',
    message: 'Mongo db related error',
    data: {}
});
messages.inValidParam = (error) => ({
    isSuccess: false,
    status: 'VALIDATION_ERROR',
    message: error,
    data: {}
});

messages.unAuthorizedRequest = (error) => ({
    isSuccess: false,
    status: 'UNAUTHORIZED',
    message: 'You are not authorized to access the request',
    data: {}
});

messages.loginSuccess = (data) => ({
    isSuccess: true,
    status: 'SUCCESS',
    message: 'Login Successful',
    data
});
messages.passwordEmailWrong = () => ({
    isSuccess: false,
    status: 'BAD_REQUEST',
    message: 'Incorrect mobile phone number or password',
    data: {},
});
messages.adminPasswordEmailWrong = () => ({
    isSuccess: false,
    status: 'BAD_REQUEST',
    message: 'Incorrect mobile phone number or password',
    data: {}
});
messages.loginFailed = (error) => ({
    isSuccess: false,
    status: 'BAD_REQUEST',
    message: `Login Failed, ${error}`,
    data: {}
});
messages.failedSoftDelete = () => ({
    isSuccess: false,
    status: 'FAILURE',
    message: 'Data can not be soft deleted due to internal server error',
    data: {}
});
messages.invalidRequest = (data) => ({
    isSuccess: false,
    status: 'FAILURE',
    message: data || "There is some Technical Problem, please retry again",
    data: {}
});

messages.invalidRequestWithData = (message, data = {}) => ({
    isSuccess: false,
    status: 'FAILURE',
    message: message,
    data: data
});
messages.requestValidated = (data) => ({
    isSuccess: true,
    status: 'SUCCESS',
    message: data,
    data: {}
});
messages.requestValidatedWithData = (message, data, meta = {}) => ({
    isSuccess: true,
    status: 'SUCCESS',
    message,
    data,
    meta
});


module.exports = { sendSocketResponse,sendSocketbadRequest, sendSocketBadResponse, sendResponse, messages };
