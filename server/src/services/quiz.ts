import { Types } from 'mongoose';
import { Category, Quiz, Track } from '../mongoose/Quiz';

export const initQuiz = (userId: Types.ObjectId, quizTitle: string): Quiz => {
    const categories: Category[] = [];
    for (let i = 0; i < 6; i++) {
        categories.push(generateEmptyCategory());
    }

    return {
        _id: new Types.ObjectId(),
        title: quizTitle,
        user: userId,
        categories,
    };

};

const generateEmptyCategory = (): Category => {
    const category = {
        _id: new Types.ObjectId(),
        title: '',
        tracks: Array.from(Array(5).keys()).map(() => generateEmptyTrack()),
    };
    category.tracks.forEach((track, index) => track.points = (index + 1)*100);

    return category;
};

const generateEmptyTrack = (): Track => {
    return {
        _id: new Types.ObjectId(),
        title: '',
        artist: '',
        trackUrl: '',
        points: 0,
        startPosition: 0,
        length: 0,
    };
};
