class AuthErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class LinkValidationErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class LogInErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = {
  AuthErr,
  NotFoundError,
  LinkValidationErr,
  LogInErr
};
