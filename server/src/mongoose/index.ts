import mongoose from 'mongoose';

export const init = async () => {
    const mongoUser = 'musicquiz-user';
    const mongoPassword = '4VLjtWnU8XRfDz4q';
    await mongoose.connect(`mongodb+srv://${mongoUser}:${mongoPassword}@music-quiz.ptregv5.mongodb.net/?retryWrites=true&w=majority`);
};
