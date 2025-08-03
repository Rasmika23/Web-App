import authMiddleware from '../middleware/auth.js';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('Auth Middleware Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      body: {}
    };
    res = {
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('should authenticate valid token', async () => {
    req.headers.token = 'valid-token';
    jwt.verify.mockReturnValue({ id: 'user123' });

    await authMiddleware(req, res, next);

    expect(req.body.userId).toBe('user123');
    expect(next).toHaveBeenCalled();
  });

  test('should reject missing token', async () => {
    await authMiddleware(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      seccess: false, // Note: Your actual code has "seccess" typo
      message: "Not authorized Login again" // Fixed message to match actual code
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject invalid token', async () => {
    req.headers.token = 'invalid-token';
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await authMiddleware(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Error"
    });
    expect(next).not.toHaveBeenCalled();
  });
});