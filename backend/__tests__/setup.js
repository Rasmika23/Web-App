// Jest setup file
// Mock environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.STRIPE_SECRET_KEY = 'test-stripe-key';
process.env.PORT = '4000';

// Global setup for tests
global.console = {
  ...console,
  // Suppress console.log in tests unless needed
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};
