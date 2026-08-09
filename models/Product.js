const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  brand: { type: String, default: 'Generic' },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true, min: 0 },
  discountPercent: { type: Number, default: 0, min: 0, max: 90 },
  stock: { type: Number, required: true, default: 0, min: 0 },
  images: [{ type: String }],
  ratingsAverage: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Text index for search across name, description, brand, category
productSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });

productSchema.virtual('finalPrice').get(function () {
  return +(this.price * (1 - this.discountPercent / 100)).toFixed(2);
});
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
