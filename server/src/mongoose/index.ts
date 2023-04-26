import mongoose from 'mongoose';

export const initMongo = async () => {
    const mongoUser = process.env.MONGO_USER;
    const mongoPassword = process.env.MONGO_PASSWORD;
    await mongoose.connect(`mongodb+srv://${mongoUser}:${mongoPassword}@music-quiz.ptregv5.mongodb.net/?retryWrites=true&w=majority`);

    console.log(`⚡️[server]: MongoDB initialized`);
};


export { QuizDocument } from './Quiz';
export { UserDocument } from './User';
