import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute';
import connectDB from './db/connectDB';
import taskRoutes from './routes/taskRoute';
import listRoutes from './routes/listRoute';
import boardRoutes from './routes/boardRoute';

dotenv.config();
connectDB();
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json({"limit": "50mb"}));
app.use(express.urlencoded({ extended: true,"limit":"50mb" }));

app.use('/api/user',userRoutes);
app.use('/api/task',taskRoutes);
app.use('/api/list',listRoutes);
app.use('/api/board',boardRoutes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
