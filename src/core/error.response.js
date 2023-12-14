`use strict`;

const StatusCode = {
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    CONFLICT: 409
}

const ReasonStatusCode = {
    BAD_REQUEST: 'Bad Request',
    FORBIDDEN: 'Forbidden Error',
    CONFLICT: 'Confict Error'
}

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.BAD_REQUEST, statusCode = StatusCode.BAD_REQUEST) {
        super(message, statusCode);
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError
}