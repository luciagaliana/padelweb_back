
import { PORT } from './config.js'
import express from 'express'
import cors from 'cors';
import cookieParser from  'cookie-parser';
import usersRoutes from './routes/users.routes.js'

const app = express();

const allowedOrigins = ['*', 'http://localhost:3000'];

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,PUT,POST,DELETE',
    credentials: true
}));

app.use(express.json())
app.use(cookieParser())

app.use(usersRoutes);

app.listen(PORT, () => {
    console.log('Servidor backend iniciado en el puerto ', PORT);
  });
