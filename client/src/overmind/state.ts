import { derived } from 'overmind';

type State = {
  apiUrl: string,
  name: string;
  token: string | null;
  isLoggedIn: boolean;
  spotifyPlayer: {
    currentlyPlaying: string | null;
    isPlaying: boolean;
    playpackPosition: number | null;
  }
}

export const state: State = {
    apiUrl: 'http://localhost:9001',
    name: 'Guest',
    token: null,
    isLoggedIn: derived((state: State) => Boolean(state.token)),
    spotifyPlayer: {
        currentlyPlaying: null,
        isPlaying: false,
        playpackPosition: null,
    },
};
