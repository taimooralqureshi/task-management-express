// index.ts

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import taskRoutes from './routes/task/task.controller';

dotenv.config();

const connectionURL = process.env.MONGODB_CONNECTION_STRING as string;
const dbName = process.env.MONGODB_DATABASE as string;
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const app = express();

// Connect to MongoDB
mongoose.connect(connectionURL, { dbName });

app.use('/api/tasks', taskRoutes); // Mount task routes under /api/task

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

