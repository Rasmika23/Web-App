import { jest } from '@jest/globals';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';
import foodModel from '../models/foodModel.js';
import fs from 'fs';

// Mock dependencies
jest.mock('../models/foodModel.js');
jest.mock('fs');

describe('Food Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      file: {}
    };
    res = {
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('addFood', () => {
    test('should add food item successfully', async () => {
      // Setup
      req.file.filename = 'test-image.jpg';
      req.body = {
        name: 'Test Food',
        description: 'Test Description',
        price: '10.99',
        category: 'Test Category'
      };

      const mockSave = jest.fn().mockResolvedValue({});
      foodModel.mockImplementation(() => ({
        save: mockSave
      }));

      // Execute
      await addFood(req, res);

      // Assert
      expect(foodModel).toHaveBeenCalledWith({
        name: 'Test Food',
        description: 'Test Description',
        price: '10.99',
        category: 'Test Category',
        image: 'test-image.jpg'
      });
      expect(mockSave).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Food Added'
      });
    });

    test('should handle addFood errors', async () => {
      // Setup
      req.file.filename = 'test-image.jpg';
      req.body = {
        name: 'Test Food',
        description: 'Test Description',
        price: '10.99',
        category: 'Test Category'
      };

      const mockSave = jest.fn().mockRejectedValue(new Error('Database error'));
      foodModel.mockImplementation(() => ({
        save: mockSave
      }));

      // Execute
      await addFood(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error'
      });
    });
  });

  describe('listFood', () => {
    test('should list all foods successfully', async () => {
      // Setup
      const mockFoods = [
        { _id: '1', name: 'Food 1', price: 10 },
        { _id: '2', name: 'Food 2', price: 15 }
      ];

      foodModel.find.mockResolvedValue(mockFoods);

      // Execute
      await listFood(req, res);

      // Assert
      expect(foodModel.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockFoods
      });
    });

    test('should handle listFood errors', async () => {
      // Setup
      foodModel.find.mockRejectedValue(new Error('Database error'));

      // Execute
      await listFood(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error'
      });
    });
  });

  describe('removeFood', () => {
    test('should remove food item successfully', async () => {
      // Setup
      req.body.id = 'food123';
      const mockFood = {
        _id: 'food123',
        image: 'test-image.jpg'
      };

      foodModel.findById.mockResolvedValue(mockFood);
      foodModel.findByIdAndDelete.mockResolvedValue({});
      fs.unlink.mockImplementation((path, callback) => callback());

      // Execute
      await removeFood(req, res);

      // Assert
      expect(foodModel.findById).toHaveBeenCalledWith('food123');
      expect(fs.unlink).toHaveBeenCalledWith('uploads/test-image.jpg', expect.any(Function));
      expect(foodModel.findByIdAndDelete).toHaveBeenCalledWith('food123');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Food Removed'
      });
    });

    test('should handle removeFood errors', async () => {
      // Setup
      req.body.id = 'food123';
      foodModel.findById.mockRejectedValue(new Error('Database error'));

      // Execute
      await removeFood(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error'
      });
    });
  });
});
