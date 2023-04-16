type State = {
    name: string,
    spotifyAccessToken: string | null, 
  }
  
  export const state: State = {
    name: 'Guest',
    spotifyAccessToken: null,
  }