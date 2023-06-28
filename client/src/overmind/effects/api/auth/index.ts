import { API_URL } from '../../utils';
import { ExchangeCodeResponse } from './types';
import request from '../../../../services/api-service';

export const auth = (() => {
    let apiToken: string;
    const baseUrl = `${API_URL}/api/auth`;

    return {
        updateAuth: (newToken: string) => {
            apiToken = newToken;
        },

        refreshSpotifyToken: async (refreshToken: string) => {
            const codeExhangeResponse = await request
                .post<ExchangeCodeResponse>(`${baseUrl}/refresh`, {
                    headers: { authorization: `Bearer ${apiToken}` },
                    body: {
                        code: refreshToken,
                    },
                });

            return codeExhangeResponse.token;
        },
    };
})();
