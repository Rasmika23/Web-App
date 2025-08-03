import { registerUser, loginUser } from '../controllers/userController.js';
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
    test('should register user successfully', async () => {
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      userModel.findOne.mockResolvedValue(null);
      validator.isEmail.mockReturnValue(true);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      
      const mockUser = { _id: 'userId123' };
      userModel.prototype.save = jest.fn().mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('test-token');

      await registerUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: 'test-token'
      });
    });

    test('should reject existing user', async () => {
      req.body = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };

      userModel.findOne.mockResolvedValue({ email: 'existing@example.com' });

      await registerUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User already exists for this mail" // Fixed message
      });
    });

    test('should reject invalid email', async () => {
      req.body = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      };

      userModel.findOne.mockResolvedValue(null);
      validator.isEmail.mockReturnValue(false);

      await registerUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Please enter a valid email"
      });
    });

    test('should reject weak password', async () => {
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123'
      };

      userModel.findOne.mockResolvedValue(null);
      validator.isEmail.mockReturnValue(true);

      await registerUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Please enter a strong password"
      });
    });
  });

  describe('loginUser', () => {
    test('should login successfully', async () => {
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
      jwt.sign.mockReturnValue('login-token');

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: 'login-token'
      });
    });

    test('should reject non-existent user', async () => {
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      userModel.findOne.mockResolvedValue(null);

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User doesn't exist" // Fixed message
      });
    });

    test('should reject invalid password', async () => {
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

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid credentials"
      });
    });
  });
});