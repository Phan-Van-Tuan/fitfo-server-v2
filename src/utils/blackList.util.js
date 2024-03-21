import { setValue, getValue } from './redis.util.js';

class BlackList {
    async push_token(token, reason) {
        await setValue(`black-list-token[${token}]`, reason, 60 * 5); // 5 minutes
    }

    async map_token(token) {
        const value = await getValue(`black-list-token[${token}]`);

        if (!value) return true; // if black

        return false; // if white
    }
}


export default new BlackList();