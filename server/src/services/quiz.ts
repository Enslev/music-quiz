import { Types } from 'mongoose';
import { CategoryDocument, Quiz, TrackDocument } from '../mongoose/Quiz';
import { PutQuizSchema } from '../routes/controllers/quiz/schema';

type RequestQuiz = PutQuizSchema['body'];
type RequestCategory = PutQuizSchema['body']['categories'][number];
type RequestTrack = PutQuizSchema['body']['categories'][number]['tracks'][number];

export const sanitizeQuizRequest = (quizRequestBody: RequestQuiz) => {

    const categories = quizRequestBody.categories.map((category: RequestCategory) => {
        const tracks = category.tracks.map((track: RequestTrack) => {
            return {
                title: track.title,
                artist: track.artist,
                trackUrl: track.trackUrl,
                points: track.points,
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
        title: quizTitle,
        user: userId,
        categories,
    };

};

const generateEmptyTrack = (): TrackDocument => {
    return {
        title: '',
        artist: '',
        trackUrl: '',
        points: 0,
    };
};

const generateEmptyCategory = (): CategoryDocument => {
    const category = {
        title: '',
        tracks: Array.from(Array(5).keys()).map(() => generateEmptyTrack()),
    };
    category.tracks.forEach((track, index) => track.points = (index + 1)*100);

    return category;
};
