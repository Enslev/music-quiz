import { state } from "../overmind/state"

export const play = () => {
    console.log('CALLING', state.spotifyAccessToken)
    // fetch('https://api.spotify.com/v1/me/player/play?device_id=a2fbc6475d5078c9725986d4804dfff78b3f30da', {
    //     method: 'PUT',
    //     headers: {
    //         'authorization': `Bearer ${token}`,
    //     }
    // })
}