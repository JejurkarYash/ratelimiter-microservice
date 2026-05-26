export class RateLimiterError extends Error {
  code: string;
  statusCode: number;

  constructor(code: string, message: string, statusCode: number) {
    super(message);
    Object.setPrototypeOf(this, RateLimiterError.prototype);
    this.code = code;
    this.name = "RateLimiterError";
    this.statusCode = statusCode;
  }
}
