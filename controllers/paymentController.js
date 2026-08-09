const Order = require('../models/Order');

// This is a MOCK payment gateway for demo/college-project purposes.
// It does not talk to any real payment provider - it just simulates
// a success/failure response so the order flow can be demonstrated end-to-end.

// @desc    Simulate processing payment for an order
// @route   POST /api/payments/:orderId
// @access  Private
const processPayment = async (req, res, next) => {
  try {
    const { cardNumberLast4, method } = req.body;

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to pay for this order' });
    }
    if (order.isPaid) {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    // Simulate a payment gateway call (always succeeds in this mock)
    const mockTransactionId = `MOCK-TXN-${Date.now()}`;

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: mockTransactionId,
      status: 'succeeded',
      updateTime: new Date().toISOString()
    };
    order.status = 'confirmed';
    if (method) order.paymentMethod = method;

    const updatedOrder = await order.save();

    res.json({
      message: 'Payment successful (mock)',
      transactionId: mockTransactionId,
      cardLast4: cardNumberLast4 || undefined,
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { processPayment };
