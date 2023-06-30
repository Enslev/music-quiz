import React, { useEffect, useState } from 'react';
import { useActions, useAppState } from '../overmind';
import { useNavigate, useParams } from 'react-router-dom';
import QuizGrid from '../components/quiz-grid/QuizGrid';
import { socket } from '../socket';

const PlayerScreenPage: React.FC = () => {

    const { session } = useAppState();
    const navigate = useNavigate();
    const { loadSession, clearSession } = useActions().sessions;
    const { hideHeader, showHeader } = useActions().ui;
    const { sessionCode } = useParams();

    const [socketRoomJoined, setSocketRoomJoined] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            if (!sessionCode) return navigate('/');
            const validSession = await loadSession(sessionCode);

            if (!validSession) {
                navigate(-1);
            }

            hideHeader();
        })();

        return () => {
            clearSession();
            showHeader();
        };
    }, []);

    useEffect(() => {
        socket.connect();

        socket.on('disconnect', () => {
            setSocketRoomJoined(false);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket.connected || socketRoomJoined || !session) return;

        socket.emit('joinSession', session.code);
        setSocketRoomJoined(true);

        setUpSocketListeners();
    }, [socket.connected, socketRoomJoined, session]);

    const setUpSocketListeners = () => {
        if (!sessionCode) return;

        socket.on('update', () => {
            loadSession(sessionCode);
        });
    };

    if (!session) return <></>;

    return <>
        <QuizGrid
            categories={session.categories}
            revealed={session.claimed.map((claim) => claim.trackId)}
        />
    </>;
};


export default PlayerScreenPage;
