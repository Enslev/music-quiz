import { Server } from 'socket.io';

let ioServer: Server | null = null;

export const initIo = (io: Server) => {
    ioServer = io;
    io.on('connection', (socket) => {
        socket.on('joinSession', (sessionCode) => {
            socket.join(sessionCode);
        });
    });
};

export const triggerSessionUpdate = (room: string) => {
    if (!ioServer) return;

    ioServer.to(room).emit('update');
};
