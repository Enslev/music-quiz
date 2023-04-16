import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    spotifyId: String,
    name: String,
});

export const User = mongoose.model('User', UserSchema);
