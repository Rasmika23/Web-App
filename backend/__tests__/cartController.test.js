import { jest } from '@jest/globals';
import { addToCart, removeFromCart, getCart } from '../controllers/cartController.js';
import userModel from '../models/userModel.js';

// Mock dependencies
jest.mock('../models/userModel.js');

describe('Cart Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      userId: 'user123',
      body: {}
    };
    res = {
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('addToCart', () => {
    test('should add new item to cart successfully', async () => {
      // Setup
      req.body.itemId = 'item123';
      const mockUser = {
        cartData: {}
      };

      userModel.findById.mockResolvedValue(mockUser);
      userModel.findByIdAndUpdate.mockResolvedValue({});

      // Execute
      await addToCart(req, res);

      // Assert
      expect(userModel.findById).toHaveBeenCalledWith('user123');
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('user123', {
        cartData: { item123: 1 }
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Added to cart'
      });
    });

    test('should increment existing item quantity in cart', async () => {
      // Setup
      req.body.itemId = 'item123';
      const mockUser = {
        cartData: { item123: 2 }
      };

      userModel.findById.mockResolvedValue(mockUser);
      userModel.findByIdAndUpdate.mockResolvedValue({});

      // Execute
      await addToCart(req, res);

      // Assert
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('user123', {
        cartData: { item123: 3 }
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Added to cart'
      });
    });

    test('should handle addToCart errors', async () => {
      // Setup
      req.body.itemId = 'item123';
      userModel.findById.mockRejectedValue(new Error('Database error'));

      // Execute
      await addToCart(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error'
      });
    });
  });

  describe('removeFromCart', () => {
    test('should remove item from cart successfully', async () => {
      // Setup
      req.body.itemId = 'item123';
      const mockUser = {
        cartData: { item123: 2 }
      };

      userModel.findById.mockResolvedValue(mockUser);
      userModel.findByIdAndUpdate.mockResolvedValue({});

      // Execute
      await removeFromCart(req, res);

      // Assert
      expect(userModel.findById).toHaveBeenCalledWith('user123');
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('user123', {
        cartData: { item123: 1 }
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Removed from cart'
      });
    });

    test('should not remove item when quantity is 0', async () => {
      // Setup
      req.body.itemId = 'item123';
      const mockUser = {
        cartData: { item123: 0 }
      };

      userModel.findById.mockResolvedValue(mockUser);
      userModel.findByIdAndUpdate.mockResolvedValue({});

      // Execute
      await removeFromCart(req, res);

      // Assert
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('user123', {
        cartData: { item123: 0 }
      });
    });

    test('should handle removeFromCart errors', async () => {
      // Setup
      req.body.itemId = 'item123';
      userModel.findById.mockRejectedValue(new Error('Database error'));

      // Execute
      await removeFromCart(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error'
      });
    });
  });

  describe('getCart', () => {
    test('should get cart data successfully', async () => {
      // Setup
      const mockUser = {
        cartData: { item123: 2, item456: 1 }
      };

      userModel.findById.mockResolvedValue(mockUser);

      // Execute
      await getCart(req, res);

      // Assert
      expect(userModel.findById).toHaveBeenCalledWith('user123');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        cartData: { item123: 2, item456: 1 }
      });
    });

    test('should handle getCart errors', async () => {
      // Setup
      userModel.findById.mockRejectedValue(new Error('Database error'));

      // Execute
      await getCart(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error'
      });
    });
  });
});
