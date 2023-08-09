    import {Router} from 'express'
    import { getCouples } from '../controllers/couples.controllers.js';

    const router = Router()

    //Ruta para autenticar al usuario
    router.get('/couples', getCouples)

    export default router;