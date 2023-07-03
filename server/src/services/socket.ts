import { Server } from 'socket.io';

let ioServer: Server | null = null;

export const initSocketIo = (io: Server) => {
    ioServer = io;
    io.on('connection', (socket) => {
        // console.log('User joined');

        // socket.on('disconnect', (reason) => {
        //     console.log('User disconnected', reason);
        // });

        socket.on('joinSession', (sessionCode: string) => {
            // console.log('Room joined -', sessionCode);
            socket.join(sessionCode);
        });

        socket.on('sessionAction', (action: SessionAction) => {
            // console.log('Got action', action);
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
