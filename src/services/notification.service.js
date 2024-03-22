import { io } from '../config/socket.config.js';
import { setValue, getValue, delValue } from '../utils/redis.util.js'

class NotificationService {
    async notify(message, senderId, receiverId) {
        getValue()
    }

}
export default new NotificationService();