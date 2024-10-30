import mongoose from 'mongoose';

const compiledTrafficDataSchema = new mongoose.Schema({
    deviceId: { type: String, required: true }, 
    data: [
        {
            timestamp: { type: Date, required: true }, 
            simpleReport: { type: String, required: true },
            detaildReport: { type: String, required: true }                
        }
    ]
});
export const CompTrafficData = mongoose.models.compiledtraffic || mongoose.model('compiledtraffic', compiledTrafficDataSchema);

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
  });
  
 export const User = mongoose.models.User || mongoose.model('User', UserSchema);