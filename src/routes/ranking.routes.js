import {Router} from 'express'
import { getRanking_couple, getRanking_single } from '../controllers/ranking.controllers.js';

const router = Router()

//Ruta para autenticar al usuario
router.get('/ranking_single', getRanking_single)

router.get('/ranking_couple', getRanking_couple)


export default router;