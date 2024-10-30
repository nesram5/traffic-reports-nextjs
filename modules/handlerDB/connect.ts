import './envConfig.ts';
import mongoose from 'mongoose';

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_DB || 'mongodb://127.0.0.1:27017/trafficMetrics');
        console.log('Successful connection to the database');
    }
     catch (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
}
