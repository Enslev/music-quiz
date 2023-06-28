import { Context } from '../';

export const loadSession = async ({ state, effects }: Context, sessionCode: string) => {
    state.session = await effects.api.sessions.getSession(sessionCode);
};

export const createSession = async ({ state, effects }: Context, quizId: string) => {
    state.session = await effects.api.sessions.PostSession({ quizId });
    return state.session;
};
