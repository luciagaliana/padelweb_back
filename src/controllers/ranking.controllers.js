import {pool} from '../db.js'
    import { getAuthorizationToken } from './authorization_helper.js';

    export const getRanking_single = async (req, res) =>{
        
        const authorization = req.get('authorization');
        const decodedToken = getAuthorizationToken(authorization);

        if(!decodedToken){
            return res.status(401).json({ error: "token is missing or invalid" });
        }

        const [ranking_single] = await pool.query(
        'SELECT * FROM ranking_individual',
        );

        return res.send(ranking_single)
    }

    export const getRanking_couple = async (req, res) =>{
        const authorization = req.get('authorization');
        const decodedToken = getAuthorizationToken(authorization);

        if(!decodedToken){
            return res.status(401).json({ error: "token is missing or invalid" });
        }
        
        const [ranking_couple] = await pool.query(
        'SELECT * FROM ranking_parejas',
        );

        res.send({ranking_couple})
        
    }