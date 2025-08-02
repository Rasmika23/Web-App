import { jest } from '@jest/globals';
import authMiddleware from '../middleware/auth.js';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('jsonwebtoken');

describe('Auth Middleware Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('should authenticate user with valid token', async () => {
    // Setup
    req.headers.token = 'valid-token';
    const mockDecoded = { id: 'user123' };
    jwt.verify.mockReturnValue(mockDecoded);

    // Execute
    await authMiddleware(req, res, next);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET);
    expect(req.userId).toBe('user123');
    expect(next).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('should return error when no token provided', async () => {
    // Setup - no token in headers

    // Execute
    await authMiddleware(req, res, next);

    // Assert
    expect(res.json).toHaveBeenCalledWith({
      seccess: false, // Note: typo exists in original code
      message: 'Not authorized Login again'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return error when token is invalid', async () => {
    // Setup
    req.headers.token = 'invalid-token';
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    // Execute
    await authMiddleware(req, res, next);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith('invalid-token', process.env.JWT_SECRET);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Error'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return error when token verification fails', async () => {
    // Setup
    req.headers.token = 'expired-token';
    jwt.verify.mockImplementation(() => {
      throw new jwt.TokenExpiredError('Token expired', new Date());
    });

    // Execute
    await authMiddleware(req, res, next);

    // Assert
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Error'
    });
    expect(next).not.toHaveBeenCalled();
  });
});
