    import {pool} from '../db.js'
    import { getAuthorizationToken } from './authorization_helper.js';

    export const getCouples = async (req, res) =>{

        const authorization = req.get('authorization');
        const decodedToken = getAuthorizationToken(authorization);

        if(!decodedToken){
            return res.status(401).json({ error: "token is missing or invalid" });
        }

        // Verificar si el usuario existe
        const [existingCouples] = await pool.query(
        'SELECT p.id_pareja, CONCAT(u1.apellido1, "-", u2.apellido1) AS nombre_pareja FROM parejas p INNER JOIN usuarios u1 ON p.id_usuario1 = u1.id INNER JOIN usuarios u2 ON p.id_usuario2 = u2.id;',);

        return res.send(existingCouples)
    }