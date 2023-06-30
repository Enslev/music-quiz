import { Context } from '..';

export const hideHeader = async ({ state }: Context) => {
    state.showHeader = false;
};

export const showHeader = async ({ state }: Context) => {
    state.showHeader = true;
};
