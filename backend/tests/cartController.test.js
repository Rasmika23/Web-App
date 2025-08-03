import { addToCart, removeFromCart, getCart } from '../controllers/cartController.js';
import userModel from '../models/userModel.js';

jest.mock('../models/userModel.js');

describe('Cart Controller Tests', () => {
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

  describe('addToCart', () => {
    test('should add item to cart', async () => {
      req.body = {
        userId: 'user123',
        itemId: 'item123'
      };

      const mockUser = {
        cartData: {},
        save: jest.fn().mockResolvedValue(true)
      };

      userModel.findById.mockResolvedValue(mockUser);

      await addToCart(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Added to cart" // Fixed message to match actual code
      });
    });

    test('should increment existing item', async () => {
      req.body = {
        userId: 'user123',
        itemId: 'item123'
      };

      const mockUser = {
        cartData: { 'item123': 2 },
        save: jest.fn().mockResolvedValue(true)
      };

      userModel.findById.mockResolvedValue(mockUser);

      await addToCart(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Added to cart" // Fixed message
      });
    });

    test('should handle add to cart error', async () => {
      req.body = {
        userId: 'user123',
        itemId: 'item123'
      };

      userModel.findById.mockRejectedValue(new Error('Database error'));

      await addToCart(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error"
      });
    });
  });

  describe('removeFromCart', () => {
    test('should remove item from cart', async () => {
      req.body = {
        userId: 'user123',
        itemId: 'item123'
      };

      const mockUser = {
        cartData: { 'item123': 1 },
        save: jest.fn().mockResolvedValue(true)
      };

      userModel.findById.mockResolvedValue(mockUser);

      await removeFromCart(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Removed from cart"
      });
    });
  });

  describe('getCart', () => {
    test('should return cart data', async () => {
      req.body = { userId: 'user123' };
      
      const mockUser = {
        cartData: { 'item1': 2, 'item2': 1 }
      };

      userModel.findById.mockResolvedValue(mockUser);

      await getCart(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        cartData: { 'item1': 2, 'item2': 1 }
      });
    });

    test('should handle get cart error', async () => {
      req.body = { userId: 'user123' };
      
      userModel.findById.mockRejectedValue(new Error('Database error'));

      await getCart(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error"
      });
    });
  });
});