// Import thư viện dotenv và load các biến môi trường từ tệp .env
import dotenv from 'dotenv';
dotenv.config();

// Import Express và tạo một ứng dụng Express mới
import express from 'express';
const app = express();

// Sử dụng middleware để phân tích các yêu cầu có nội dung là JSON
app.use(express.json());

// Import thư viện http và tạo một máy chủ HTTP
import { createServer } from 'http';
var server = createServer(app);

// Sử dụng middleware Cors để xử lý yêu cầu từ các miền khác nhau
import cors from 'cors';
app.use(cors());

// Sử dụng middleware Helmet để bảo mật ứng dụng bằng cách thiết lập các HTTP header an toàn
import helmet from 'helmet';
app.use(helmet());

// Sử dụng middleware Morgan để ghi log các yêu cầu HTTP đến máy chủ
import logger from 'morgan';
app.use(logger("dev"));

// Kết nối đến cơ sở dữ liệu MongoDB sử dụng thông tin kết nối từ biến môi trường
import DatabaseLoader from './src/config/database.config.js';
const uri = process.env.MONGODB_URI;
DatabaseLoader.connect(uri);

// Load các tuyến đường (routes) của ứng dụng
import RoutesLoader from './src/config/router.config.js';
RoutesLoader.init(app);

// Load các middleware xử lý ngoại lệ (exception)
import CatchLoader from './src/config/catch.config.js';
CatchLoader.init(app);

// Load cấu hình và khởi tạo socket.io cho máy chủ
import SocketLoader from './src/config/socket.config.js';
SocketLoader.init(server);

// Xác định cổng mà máy chủ sẽ lắng nghe, sử dụng cổng mặc định 3300 hoặc cổng được cấu hình từ biến môi trường
const PORT = process.env.PORT || 3300;
server.listen(PORT, () => {
    console.log(`👌 Server running at http://localhost:${PORT}`);
});
