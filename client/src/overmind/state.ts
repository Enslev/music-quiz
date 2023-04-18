import { derived } from 'overmind';

type State = {
  name: string;
  token: string | null;
  isLoggedIn: boolean;
}

export const state: State = {
    name: 'Guest',
    token: null,
    isLoggedIn: derived((state: State) => Boolean(state.token)),
};
