import { jest } from '@jest/globals';
import { placeOrder, verifyOrder, userOrders, listOrder, updateStatus } from '../controllers/orderController.js';
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';

// Mock dependencies
jest.mock('../models/orderModel.js');
jest.mock('../models/userModel.js');
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({
          url: 'https://checkout.stripe.com/session123'
        })
      }
    }
  }));
});

// Mock environment variables
process.env.STRIPE_SECRET_KEY = 'test_key';

describe('Order Controller Tests', () => {
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

  describe('placeOrder', () => {
    test('should place order successfully', async () => {
      // Setup
      req.body = {
        items: [
          { name: 'Pizza', price: 15, quantity: 2 },
          { name: 'Burger', price: 10, quantity: 1 }
        ],
        amount: 40,
        address: { street: '123 Main St', city: 'Test City' }
      };

      const mockOrder = { _id: 'order123' };
      const mockSave = jest.fn().mockResolvedValue(mockOrder);
      orderModel.mockImplementation(() => ({
        save: mockSave,
        _id: 'order123'
      }));

      userModel.findByIdAndUpdate.mockResolvedValue({});

      // Execute
      await placeOrder(req, res);

      // Assert
      expect(orderModel).toHaveBeenCalledWith({
        userId: 'user123',
        items: req.body.items,
        amount: 40,
        address: req.body.address
      });
      expect(mockSave).toHaveBeenCalled();
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('user123', { cartData: {} });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        session_url: 'https://checkout.stripe.com/session123'
      });
    });

    test('should handle placeOrder errors', async () => {
      // Setup
      req.body = {
        items: [],
        amount: 0,
        address: {}
      };

      const mockSave = jest.fn().mockRejectedValue(new Error('Database error'));
      orderModel.mockImplementation(() => ({
        save: mockSave
      }));

      // Execute
      await placeOrder(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error'
      });
    });
  });

  describe('verifyOrder', () => {
    test('should verify successful payment', async () => {
      // Setup
      req.body = {
        orderId: 'order123',
        success: 'true'
      };

      orderModel.findByIdAndUpdate.mockResolvedValue({});

      // Execute
      await verifyOrder(req, res);

      // Assert
      expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith('order123', { payment: true });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Paid'
      });
    });

    test('should handle failed payment', async () => {
      // Setup
      req.body = {
        orderId: 'order123',
        success: 'false'
      };

      orderModel.findByIdAndDelete.mockResolvedValue({});

      // Execute
      await verifyOrder(req, res);

      // Assert
      expect(orderModel.findByIdAndDelete).toHaveBeenCalledWith('order123');
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not Paid'
      });
    });

    test('should handle verifyOrder errors', async () => {
      // Setup
      req.body = {
        orderId: 'order123',
        success: 'true'
      };

      orderModel.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

      // Execute
      await verifyOrder(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error'
      });
    });
  });

  describe('userOrders', () => {
    test('should get user orders successfully', async () => {
      // Setup
      const mockOrders = [
        { _id: 'order1', userId: 'user123', amount: 25 },
        { _id: 'order2', userId: 'user123', amount: 35 }
      ];

      orderModel.find.mockResolvedValue(mockOrders);

      // Execute
      await userOrders(req, res);

      // Assert
      expect(orderModel.find).toHaveBeenCalledWith({ userId: 'user123' });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockOrders
      });
    });

    test('should handle userOrders errors', async () => {
      // Setup
      orderModel.find.mockRejectedValue(new Error('Database error'));

      // Execute
      await userOrders(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error'
      });
    });
  });

  describe('listOrder', () => {
    test('should list all orders successfully', async () => {
      // Setup
      const mockOrders = [
        { _id: 'order1', amount: 25 },
        { _id: 'order2', amount: 35 }
      ];

      orderModel.find.mockResolvedValue(mockOrders);

      // Execute
      await listOrder(req, res);

      // Assert
      expect(orderModel.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockOrders
      });
    });

    test('should handle listOrder errors', async () => {
      // Setup
      orderModel.find.mockRejectedValue(new Error('Database error'));

      // Execute
      await listOrder(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error'
      });
    });
  });

  describe('updateStatus', () => {
    test('should update order status successfully', async () => {
      // Setup
      req.body = {
        orderId: 'order123',
        status: 'Delivered'
      };

      orderModel.findByIdAndUpdate.mockResolvedValue({});

      // Execute
      await updateStatus(req, res);

      // Assert
      expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith('order123', { status: 'Delivered' });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Status updated'
      });
    });

    test('should handle updateStatus errors', async () => {
      // Setup
      req.body = {
        orderId: 'order123',
        status: 'Delivered'
      };

      orderModel.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

      // Execute
      await updateStatus(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error'
      });
    });
  });
});
