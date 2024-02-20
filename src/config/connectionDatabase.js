import mongoose from 'mongoose';

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('👌 connect DB successfully!!');
        console.log('');
        console.log('------------------------');
    } catch (error) {
        console.log('😵‍💫 connect DB failure!!');
        console.error(error);
    }
}
export default connectDB;

