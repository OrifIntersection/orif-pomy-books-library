import { ERROR_CODES } from "./errorCodes.js";

class AppError extends Error {
  constructor(code) {

    const errorDef = ERROR_CODES[code];

    if (!errorDef) {
      // Fail fast if someone uses an unknown code
      console.error("UNKNOWN ERROR CODE USED :" + code)
      super('Unknown error code');
      this.statusCode = 500;
      this.status = 'error';
      this.isOperational = false;
      return;
    }

    super(errorDef.message);
    this.statusCode = errorDef.statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
