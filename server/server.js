import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import app from './src/app.js';
import { initCronJobs } from './src/jobs/cronJobs.js';
import Product from './src/models/Product.js';
import { seedData } from './src/utils/seed.js';

// Load env variables
dotenv.config();

// Connect to MongoDB
const startServer = async () => {
  await connectDB();

  // Automatic Database Seeding if empty
  try {
    const productCount = await Product.countDocuments({});
    if (productCount === 0) {
      console.log('Product database is empty. Running automatic seed data...');
      await seedData();
    } else {
      console.log(`Database already populated (${productCount} products found). Skipping seeding.`);
    }
  } catch (error) {
    console.error('Failed to check or run database seed:', error.message);
  }

  // Initialize node-cron background jobs
  initCronJobs();

  // Listen Port
  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections gracefully
  process.on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
};

startServer();
