import { derived } from 'overmind';
import { Quiz } from './effects/api/quizzes/types';
import { Session } from './effects/api/sessions/types';
import { SpotiyDeviceObject } from './effects/api/spotify/types';

type State = {
  apiUrl: string,
  name: string;
  token: string | null;
  isLoggedIn: boolean;
  spotifyPlayer: {
    currentlyPlaying: string | null;
    isPlaying: boolean;
    playpackPosition: number | null;
  },
  showHeader: boolean,
  quiz: Quiz | null,
  session: Session | null,
  selectedDevice: SpotiyDeviceObject | null,
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
    showHeader: true,
    quiz: null,
    session: null,
    selectedDevice: null,
};
