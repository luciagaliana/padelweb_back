import { PORT } from './config.js'
import express from 'express'
import cors from 'cors';
import cookieParser from  'cookie-parser';
import usersRoutes from './routes/users.routes.js'
import matchesRoutes from './routes/matches.routes.js'
import rankingRoutes from './routes/ranking.routes.js'
import tournamentRoutes from './routes/tournament.routes.js'
import couplesRoutes from './routes/couples.routes.js'

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
app.use(matchesRoutes);
app.use(rankingRoutes);
app.use(tournamentRoutes);
app.use(couplesRoutes);

app.listen(PORT, () => {
    console.log('Servidor backend iniciado en el puerto ', PORT);
  });