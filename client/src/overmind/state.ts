type State = {
    name: string,
    spotifyAccessToken: string | null, 
    spotifyRefreshToken: string | null,
  }
  
  export const state: State = {
    name: 'Guest',
    spotifyAccessToken: null,
    spotifyRefreshToken: null,
  }