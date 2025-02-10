// helpers/error.js

class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super(message); // Call the parent class (Error) constructor with the message
    this.statusCode = statusCode; // Store the HTTP status code
    this.message = message; // Store the error message

    // Ensure that the name of this error is set to 'ErrorHandler'
    this.name = this.constructor.name;

    // Capture the stack trace to provide more details in the error response
    Error.captureStackTrace(this);
  }
}

// Export the ErrorHandler class
module.exports = { ErrorHandler };
