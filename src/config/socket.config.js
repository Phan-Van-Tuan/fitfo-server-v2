import { Server } from 'socket.io';
import { setValue, delValue } from '../utils/redis.util.js'

class SocketLoader {
    static soketIo;

    static init(server) {
        SocketLoader.soketIo = new Server(server);

        SocketLoader.soketIo.on('connection', (socket) => {
            socket.on('addUserId', async (userId) => {
                console.log("new connection ", socket.id + " " + userId);
                await setValue(socket.id, userId, 60 * 60 * 24);
            })

        });

        SocketLoader.soketIo.on('disconnect', async (socket) => {
            await delValue(socket.id);
        })

    };
}


const io = SocketLoader.soketIo;

export { io }
export default SocketLoader;
