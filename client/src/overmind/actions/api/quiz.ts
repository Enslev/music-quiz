import { Context } from '../..';
import request from '../../../services/api-service';

export const getQuizzes = async ({ state }: Context) => {

    const response = await request.get('http://localhost:9001/api/quiz', {
        headers: { authorization: `Bearer ${state.token}` },
        // query: { populate: 'user' },
    });

    console.log(response);
};
