import 'dotenv/config';
import express from 'express';
import { connectDB } from './config/db.js';
import router from './routes/index.js';
import notFound from './middleware/404.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;
const HOST_NAME = process.env.HOST_NAME || 'localhost';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);
app.use(notFound);
app.use(errorHandler);

(async () => {
    try {
        await connectDB();
        app.listen(PORT, HOST_NAME, () => {
            console.log(`Server chạy tại http://${HOST_NAME}:${PORT}`);
        });
    } catch (err) {
        console.error('Lỗi khởi động:', err.message);
        process.exit(1);
    }
})();