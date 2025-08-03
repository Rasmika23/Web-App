import { addFood, listFood, removeFood } from '../controllers/foodController.js';
import foodModel from '../models/foodModel.js';

jest.mock('../models/foodModel.js');
jest.mock('fs');

describe('Food Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      file: null
    };
    res = {
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('addFood', () => {
    test('should add food successfully', async () => {
      req.body = {
        name: 'Pizza',
        description: 'Delicious pizza',
        price: '15',
        category: 'Italian'
      };
      req.file = {
        filename: 'pizza.jpg'
      };

      foodModel.prototype.save = jest.fn().mockResolvedValue({
        _id: 'foodId123'
      });

      await addFood(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Food Added"
      });
    });

    test('should handle add food error', async () => {
      req.body = {
        name: 'Pizza',
        description: 'Delicious pizza',
        price: '15',
        category: 'Italian'
      };
      req.file = {
        filename: 'pizza.jpg'
      };

      foodModel.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      await addFood(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error"
      });
    });
  });

  describe('listFood', () => {
    test('should return list of foods', async () => {
      const mockFoods = [
        { _id: '1', name: 'Pizza', price: 15 },
        { _id: '2', name: 'Burger', price: 10 }
      ];

      foodModel.find.mockResolvedValue(mockFoods);

      await listFood(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockFoods
      });
    });

    test('should handle list food error', async () => {
      foodModel.find.mockRejectedValue(new Error('Database error'));

      await listFood(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error"
      });
    });
  });

  describe('removeFood', () => {
    test('should remove food successfully', async () => {
      req.body = { id: 'foodId123' };
      
      const mockFood = {
        _id: 'foodId123',
        image: 'food.jpg'
      };

      foodModel.findById.mockResolvedValue(mockFood);
      foodModel.findByIdAndDelete.mockResolvedValue(mockFood);

      await removeFood(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Food Removed"
      });
    });

    test('should handle remove food error', async () => {
      req.body = { id: 'foodId123' };
      
      foodModel.findById.mockRejectedValue(new Error('Database error'));

      await removeFood(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error"
      });
    });
  });
});