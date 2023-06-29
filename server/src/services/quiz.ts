import { Types } from 'mongoose';
import { CategoryDocument, Quiz, TrackDocument } from '../mongoose/Quiz';
import { PutQuizSchema } from '../routes/controllers/quizzes/schema';

type RequestQuiz = PutQuizSchema['body'];
type RequestCategory = PutQuizSchema['body']['categories'][number];
type RequestTrack = PutQuizSchema['body']['categories'][number]['tracks'][number];

export const sanitizeQuizRequest = (quizRequestBody: RequestQuiz) => {

    const categories = quizRequestBody.categories.map((category: RequestCategory) => {
        const tracks: Omit<RequestTrack, '_id'>[] = category.tracks.map((track: RequestTrack) => {
            return {
                title: track.title,
                artist: track.artist,
                trackUrl: track.trackUrl,
                points: track.points,
                startPosition: track.startPosition,
                length: track.length,
            };
        });

        return {
            title: category.title,
            tracks,
        };
    });

    return {
        title: quizRequestBody.title,
        categories,
    };
};

export const initQuiz = (userId: Types.ObjectId, quizTitle: string): Quiz => {
    const categories: CategoryDocument[] = [];
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

const generateEmptyTrack = (): TrackDocument => {
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

const generateEmptyCategory = (): CategoryDocument => {
    const category = {
        _id: new Types.ObjectId(),
        title: '',
        tracks: Array.from(Array(5).keys()).map(() => generateEmptyTrack()),
    };
    category.tracks.forEach((track, index) => track.points = (index + 1)*100);

    return category;
};
