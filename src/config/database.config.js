import mongoose from 'mongoose';
mongoose.set('strictQuery', true);

async function connect(uri) {
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

class DatabaseLoader {
    static init(uri) {
        connect(uri);
    }
}

export default DatabaseLoader;

