import UserService from '../services/user.service.js';

class UserController {
    async updateProfile(req, res, next) {
        res.json('this is get all users');
    }

    async getAllUsers(req, res) {
        res.json('this is get all users');
    }
};

export default new UserController;
