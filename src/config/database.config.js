import mongoose from 'mongoose';
mongoose.set('strictQuery', true);

class DatabaseLoader {
    static async connect(uri) {
        try {
            await mongoose.connect(uri);
            console.log('👌 connect DB successfully!!');
            console.log('');
            console.log('------------------------');
        } catch (error) {
            console.log('😵‍💫 connect DB failure!!');
            console.error(error);
        }
    }
}
export default DatabaseLoader;

