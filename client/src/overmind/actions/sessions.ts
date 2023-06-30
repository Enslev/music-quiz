import { Context } from '../';
import { Claimed, Team } from '../effects/api/sessions/types';

export const loadSession = async ({ state, effects }: Context, sessionCode: string) => {
    try {
        state.session = await effects.api.sessions.getSession(sessionCode);
        return true;
    } catch(e) {
        if (e == 'Not Found') {
            return false;
        }
    }
};


export const clearSession = async ({ state }: Context) => {
    state.session = null;
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

export const deleteTeam = async ({ state, effects }: Context, team: Team) => {
    const sessionId = state.session?._id;

    if (!sessionId) return;

    state.session = await effects.api.sessions.deleteTeam(sessionId, team._id);
    return state.session;
};

export const claimTrack = async ({ state, effects }: Context, claimedTrack: Claimed) => {
    const sessionId = state.session?._id;

    if (!sessionId) return;

    state.session = await effects.api.sessions.claimTrack(sessionId, claimedTrack);
    return state.session;
};
