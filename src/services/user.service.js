


// Dữ liệu người dùng mới
const modifiedUserData = {
    "user": {
        "firstName": "Tuan",
        "lastName": "Phan",
        "email": "sa@gmail.com",
        "password": "$2b$10$Q805Cr9E3W46oDZn9mv5der8uP3GYvkpkc6HryAcviYREzdg2REqe",
        "avatar": "https://firebasestorage.googleapis.com/v0/b/fitfo-storage.appspot.com/o/avatars%2Flogo_default.png?alt=media&token=7d6ef2a3-383d-430d-a94c-89e272ae1dea",
        "role": "user",
        "gender": "male",
        "birthday": "02/09/2002",
        "account": "default",
        "_id": "65c89a9ad8d1875e33b3fdb4"
    }
};

class UserService {
    async getUserByEmail(email) {
        const user = await _User.find(email);
        return user;
    }

}
export default new UserService();