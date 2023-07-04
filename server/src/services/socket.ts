import { Server } from 'socket.io';

let ioServer: Server | null = null;

export const initSocketIo = (io: Server) => {
    ioServer = io;
    io.on('connection', (socket) => {

        socket.on('joinSession', (sessionCode: string) => {
            socket.join(sessionCode);
        });

        socket.on('sessionAction', (action: SessionAction) => {
            socket.to(action.sessionCode).emit('sessionAction', action);
        });
    });
};

export const triggerSessionUpdate = (sessionCode: string) => {
    if (!ioServer) return;
    ioServer.to(sessionCode).emit('update');
};

interface SessionAction {
    sessionCode: string;
}
