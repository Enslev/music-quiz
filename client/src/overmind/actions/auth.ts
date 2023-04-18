import { Context } from '..';
import request from '../../services/api-service';

interface ExchangeCodeResponse {
    token: string;
}

export const loginWithCode = async ({ state }: Context, code: string) => {
    const codeExhangeResponse = await request
        .post<ExchangeCodeResponse>('http://localhost:9001/api/auth/code', {
            body: { code },
        });

    state.token = codeExhangeResponse.token;

    localStorage.setItem('token', state.token);
};

export const logout = ({ state }: Context) => {
    state.token = null;
    localStorage.removeItem('token');
};
