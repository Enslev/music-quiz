import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
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

export const emitChallengeAction = (socket: Socket, action: SessionActionPayload) => {
    console.log(action);
    socket.emit('sessionAction', action);
};

export type ChallengeShowAction = {
    type: 'challengeAction',
    show: true,
    category: string,
    points: number,
}
export type ChallengeHideAction = {
    type: 'challengeAction',
    show: false,
}

export interface SessionActionPayload {
    sessionCode: string;
    action: ChallengeShowAction | ChallengeHideAction
}

export type SessionAction = SessionActionPayload['action'];
