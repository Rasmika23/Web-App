// Mock Stripe before importing
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

import { verifyOrder, userOrders, listOrders } from '../controllers/orderController.js';
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';

jest.mock('../models/orderModel.js');
jest.mock('../models/userModel.js');

describe('Order Controller Tests', () => {
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

  describe('userOrders', () => {
    test('should return user orders', async () => {
      req.body = { userId: 'user123' };
      
      const mockOrders = [
        { _id: 'order1', amount: 25 },
        { _id: 'order2', amount: 35 }
      ];

      orderModel.find.mockResolvedValue(mockOrders);

      await userOrders(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockOrders
      });
    });
  });

  describe('listOrders', () => {
    test('should return all orders', async () => {
      const mockOrders = [
        { _id: 'order1', amount: 25 },
        { _id: 'order2', amount: 35 }
      ];

      orderModel.find.mockResolvedValue(mockOrders);

      await listOrders(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockOrders
      });
    });
  });

  describe('verifyOrder', () => {
    test('should verify successful payment', async () => {
      req.body = {
        orderId: 'order123',
        success: 'true'
      };

      const mockOrder = {
        payment: false,
        save: jest.fn().mockResolvedValue(true)
      };

      orderModel.findById.mockResolvedValue(mockOrder);
      userModel.findByIdAndUpdate.mockResolvedValue(true);

      await verifyOrder(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Paid"
      });
    });
  });
});