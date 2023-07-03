import { useEffect, useState } from 'react';
import { socket } from '../socket';

export const useSessionSocket = (sessionCode: string | null) => {
    const [localSocket, setLocalSocket] = useState<typeof socket | null>(null);

    useEffect(() => {
        if (socket.connected || sessionCode == null) return;
        socket.connect();

        socket.on('connect', () => {
            socket.emit('joinSession', sessionCode);
            setLocalSocket(socket);
        });

        return () => {
            setLocalSocket(null);
            socket.disconnect();
        };
    }, [sessionCode]);

    return localSocket;
};
