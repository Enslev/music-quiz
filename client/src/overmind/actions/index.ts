import { Context } from '..';

const localStorage = window.localStorage;

export const onInitializeOvermind = async ({
    state,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    actions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    effects,
}: Context) => {
    state.token = localStorage.getItem('token');
};

export * as auth from './auth';
export * as api from './api';
