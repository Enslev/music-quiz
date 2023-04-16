import { derived } from 'overmind';

type State = {
  name: string;
  spotifyAccessToken: string | null; 
  spotifyRefreshToken: string | null;
  isLoggedIn: boolean;
}
  
export const state: State = {
    name: 'Guest',
    spotifyAccessToken: null,
    spotifyRefreshToken: null,
    isLoggedIn: derived((state: State) => Boolean(state.spotifyAccessToken)),
};
