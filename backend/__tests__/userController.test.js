import { jest } from '@jest/globals';
import { loginUser, registerUser } from '../controllers/userController.js';
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';

// Mock dependencies
jest.mock('../models/userModel.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('validator');

describe('User Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    test('should register a new user successfully', async () => {
      // Setup
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      userModel.findOne.mockResolvedValue(null);
      validator.isEmail.mockReturnValue(true);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      userModel.prototype.save = jest.fn().mockResolvedValue({ _id: 'userId123' });
      jwt.sign.mockReturnValue('mockToken');

      // Execute
      await registerUser(req, res);

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(validator.isEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: 'mockToken'
      });
    });

    test('should return error if user already exists', async () => {
      // Setup
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      userModel.findOne.mockResolvedValue({ email: 'test@example.com' });

      // Execute
      await registerUser(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User already exists for this mail'
      });
    });

    test('should return error for invalid email', async () => {
      // Setup
      req.body = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      };

      userModel.findOne.mockResolvedValue(null);
      validator.isEmail.mockReturnValue(false);

      // Execute
      await registerUser(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Please enter a valid email'
      });
    });

    test('should return error for weak password', async () => {
      // Setup
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123'
      };

      userModel.findOne.mockResolvedValue(null);
      validator.isEmail.mockReturnValue(true);

      // Execute
      await registerUser(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Please enter a strong password'
      });
    });

    test('should handle registration errors', async () => {
      // Setup
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      userModel.findOne.mockRejectedValue(new Error('Database error'));

      // Execute
      await registerUser(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error'
      });
    });
  });

  describe('loginUser', () => {
    test('should login user successfully', async () => {
      // Setup
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        _id: 'userId123',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      userModel.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockToken');

      // Execute
      await loginUser(req, res);

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: 'mockToken'
      });
    });

    test('should return error if user does not exist', async () => {
      // Setup
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      userModel.findOne.mockResolvedValue(null);

      // Execute
      await loginUser(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User doesn't exist"
      });
    });

    test('should return error for invalid credentials', async () => {
      // Setup
      req.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const mockUser = {
        _id: 'userId123',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      userModel.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      // Execute
      await loginUser(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid credentials'
      });
    });

    test('should handle login errors', async () => {
      // Setup
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      userModel.findOne.mockRejectedValue(new Error('Database error'));

      // Execute
      await loginUser(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error'
      });
    });
  });
});