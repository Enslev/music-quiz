import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function SpotifyCallbackComponent() {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');

    useEffect(() => {
        const exchangeCode = async (code: string) => {
            const response = await fetch('http://localhost:9001/api/spotify/code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'Application/json',
                },
                body: JSON.stringify({ code }),
            });
            const body = await response.json() as { access_token: string };
            console.log(body)
            play(body.access_token);
        }

        exchangeCode(code ?? '');
    }, [code]);

    const play = (token: string) => {
        console.log('CALLING', token)
        fetch('https://api.spotify.com/v1/me/player/play?device_id=a2fbc6475d5078c9725986d4804dfff78b3f30da', {
            method: 'PUT',
            headers: {
                'authorization': `Bearer ${token}`,
            }
        })
    }

    return <>Loading</>;

}

export default SpotifyCallbackComponent;