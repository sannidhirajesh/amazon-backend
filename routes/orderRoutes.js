const express = require('express');
const router = express.Router();
const {
  placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(authorize('admin'), getAllOrders)
  .post(placeOrder);

router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', authorize('admin'), updateOrderStatus);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
