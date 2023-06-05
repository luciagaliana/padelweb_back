
import { PORT } from './config.js'
import express from 'express'
import cors from 'cors';

import usersRoutes from './routes/users.routes.js'

const app = express();

app.use(cors({
    origin: '*',
    methods: 'GET,PUT,POST,DELETE',
}));

app.use(express.json())

app.use(usersRoutes);

app.listen(PORT, () => {
    console.log('Servidor backend iniciado en el puerto ', PORT);
  });