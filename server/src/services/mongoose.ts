import mongoose from 'mongoose';

export const init = async () => {
    const mongoUser = process.env.MONGO_USER;
    const mongoPassword = process.env.MONGO_PASSWORD;
    await mongoose.connect(`mongodb+srv://${mongoUser}:${mongoPassword}@music-quiz.ptregv5.mongodb.net/?retryWrites=true&w=majority`);
    console.log('Connected to mongodb');
};
