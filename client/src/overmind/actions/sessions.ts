import { Context } from '../';
import { Team } from '../effects/api/sessions/types';

export const loadSession = async ({ state, effects }: Context, sessionCode: string) => {
    state.session = await effects.api.sessions.getSession(sessionCode);
};

export const createSession = async ({ state, effects }: Context, quizId: string) => {
    state.session = await effects.api.sessions.PostSession({ quizId });
    return state.session;
};

export const createteam = async ({ state, effects }: Context, name: string) => {
    const sessionId = state.session?._id;

    if (!sessionId) return;

    state.session = await effects.api.sessions.postTeam(sessionId, { name });
    return state.session;
};

export const updateTeam = async ({ state, effects }: Context, team: Team) => {
    const sessionId = state.session?._id;

    if (!sessionId) return;

    state.session = await effects.api.sessions.putTeam(sessionId, team);
    return state.session;
};
