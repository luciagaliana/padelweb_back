import {pool} from '../db.js'
    import { getAuthorizationToken } from './authorization_helper.js';

    export const getMatches = async (req, res) =>{

        const authorization = req.get('authorization');
        const decodedToken = getAuthorizationToken(authorization);

        if(!decodedToken){
            return res.status(401).json({ error: "token is missing or invalid" });
        }

        // Verificar si el usuario existe
        const [existingMatches] = await pool.query(
        'SELECT * FROM partidos',
        );

        return res.send({existingMatches})
    }