import {Router} from 'express'
import {  getRankingUser_individual, getRankingUser_couple, getRanking_couple, getRanking_single, getRankingUserTable, getRankingTable } from '../controllers/ranking.controllers.js';

const router = Router()

//Ruta para sacar todos los ranking individuales
router.get('/ranking_single', getRanking_single)

//Ruta para sacar todos los ranking por parejas
router.get('/ranking_couple', getRanking_couple)

//Ruta para sacar la posición en los ranking individuales del usuario autenticado
router.get('/rankingUserIndividual', getRankingUser_individual)

//Ruta para sacar la posición en los ranking por parejas del usuario autenticado
router.get('/rankingUserCouple', getRankingUser_couple)

//Ruta para sacar los datos necesarios en la tabla de página principal
router.get('/rankingUserTable', getRankingUserTable)

//Ruta para sacar los datos necesarios en la tabla de la página de Rankings
router.get('/rankingTable', getRankingTable)


export default router;