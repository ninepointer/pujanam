class ApiResponse {
    static sendResponse(res, statusCode, status,  data, message = '', error) {
        res.status(statusCode).json({
            status,
            message,
            data,
            error,
        });
    }

    static success(res, data, message = 'Request successful') {
        this.sendResponse(res, 200, 'success', data, message);
    }

    static created(res, data, message = 'Resource created successfully') {
        this.sendResponse(res, 201, 'success', data, message);
    }

    static notFound(res, message = 'Resource not found') {
        this.sendResponse(res, 404, 'error', null, message);
    }

    static error(res, message = 'Something went wrong', statusCode = 500, error) {
        this.sendResponse(res, statusCode, 'error',  null, message, error);
    }
}

module.exports = ApiResponse;
