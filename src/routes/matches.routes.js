import {Router} from 'express'
    import jwt from 'jsonwebtoken';
    import { createMatch, getMatches } from '../controllers/matches.controllers.js';

    const router = Router()

    //Ruta para obtener los partidos
    router.get('/match', getMatches)

    //Ruta para crear un partido
    router.post('/match', createMatch)

    export default router;