import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer = null;

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/aurelia';
    
    // Set a short server selection timeout of 2 seconds so we don't hang 
    // if a local MongoDB service is not running on the machine.
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected to Standard: ${conn.connection.host}`);
  } catch (error) {
    console.warn('Could not connect to standard local MongoDB. Launching In-Memory MongoDB Server Fallback...');
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(mongoUri);
      console.log(`In-Memory MongoDB Server Connected successfully at: ${mongoUri}`);
    } catch (memError) {
      console.error(`Failed to launch In-Memory MongoDB Server: ${memError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
