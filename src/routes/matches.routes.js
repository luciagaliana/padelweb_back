import {Router} from 'express'
    import jwt from 'jsonwebtoken';
    import { getMatches } from '../controllers/matches.controllers.js';

    const router = Router()

    //Ruta para autenticar al usuario
    router.get('/matches', getMatches)

    export default router;