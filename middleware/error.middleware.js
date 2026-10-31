const errorMiddleware = (err, req, res, next) => {
    // Handle requests that exceed the JSON body size limit
    if (err.type === "entity.too.large") {
        return res.status(413).json({
            message: "Request body is too large. Maximum size is 10kb."
        });
    }

    const statusCode = err.statusCode || 500;

    if (statusCode >= 500) {
        console.error(err);
    }

    res.status(statusCode).json({
        message:
            statusCode >= 500
                ? "Internal Server Error"
                : err.message || "Request failed"
    });
};

module.exports = errorMiddleware;