class CustomError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
	}
}

const createCustomError = (msg, status) => {
	return new CustomError(msg, status);
};

module.exports = { createCustomError, CustomError };
