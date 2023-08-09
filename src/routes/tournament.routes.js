    import {Router} from 'express'

    const router = Router()

    import {pool} from '../db.js'
    import { createTournament, deleteTournament, getTournament, getTournamentUser } from '../controllers/tournament.controllers.js'

    //Ruta para sacar todos los ranking individuales
    router.get('/tournament', getTournament)

    //Ruta para sacar todos los ranking individuales
    router.get('/tournamentUser', getTournamentUser)

    //Ruta para crear torneo
    router.post('/tournament', createTournament)

    //Ruta para eliminar torneo
    router.delete('/tournament', deleteTournament)

    export default router;
