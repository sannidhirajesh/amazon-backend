// Run with: npm run seed
// Populates the DB with a demo admin, seller, and a handful of products.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

const run = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([User.deleteMany(), Product.deleteMany(), Cart.deleteMany()]);

  console.log('Creating users...');
  const admin = await User.create({ name: 'Admin', email: 'admin@example.com', password: 'admin123', role: 'admin' });
  const seller = await User.create({ name: 'Demo Seller', email: 'seller@example.com', password: 'seller123', role: 'seller' });
  const customer = await User.create({ name: 'Demo Customer', email: 'customer@example.com', password: 'customer123', role: 'customer' });

  await Cart.create({ user: customer._id, items: [] });
  customer.cart = (await Cart.findOne({ user: customer._id }))._id;
  await customer.save();

  console.log('Creating products...');
  const products = await Product.insertMany([
    {
      name: 'Wireless Bluetooth Headphones',
      description: 'Over-ear headphones with active noise cancellation and 30-hour battery life.',
      brand: 'SoundWave',
      category: 'Electronics',
      price: 2999,
      discountPercent: 15,
      stock: 50,
      images: ['https://via.placeholder.com/400x400?text=Headphones'],
      seller: seller._id
    },
    {
      name: 'Mechanical Keyboard RGB',
      description: 'Compact 87-key mechanical keyboard with hot-swappable switches and RGB backlight.',
      brand: 'KeyForge',
      category: 'Electronics',
      price: 3499,
      discountPercent: 10,
      stock: 30,
      images: ['https://via.placeholder.com/400x400?text=Keyboard'],
      seller: seller._id
    },
    {
      name: 'Cotton Casual T-Shirt',
      description: 'Breathable 100% cotton t-shirt, regular fit, available in multiple colors.',
      brand: 'UrbanThreads',
      category: 'Fashion',
      price: 499,
      discountPercent: 20,
      stock: 200,
      images: ['https://via.placeholder.com/400x400?text=T-Shirt'],
      seller: seller._id
    },
    {
      name: 'Stainless Steel Water Bottle',
      description: 'Vacuum insulated 1L bottle, keeps drinks cold for 24 hours and hot for 12 hours.',
      brand: 'HydroLife',
      category: 'Home & Kitchen',
      price: 799,
      discountPercent: 5,
      stock: 100,
      images: ['https://via.placeholder.com/400x400?text=Bottle'],
      seller: seller._id
    },
    {
      name: 'Deep Learning with Python (Book)',
      description: 'A hands-on introduction to deep learning and neural networks using Python.',
      brand: 'TechPress',
      category: 'Books',
      price: 1199,
      discountPercent: 0,
      stock: 40,
      images: ['https://via.placeholder.com/400x400?text=Book'],
      seller: seller._id
    }
  ]);

  console.log('Seed complete:');
  console.log(`  Admin login:    admin@example.com / admin123`);
  console.log(`  Seller login:   seller@example.com / seller123`);
  console.log(`  Customer login: customer@example.com / customer123`);
  console.log(`  Products created: ${products.length}`);

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
