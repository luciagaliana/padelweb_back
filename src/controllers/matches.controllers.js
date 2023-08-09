    import {pool} from '../db.js'
    import { getAuthorizationToken } from './authorization_helper.js';

    export const getMatches = async (req, res) =>{
        const authorization = req.get('authorization');
        const decodedToken = getAuthorizationToken(authorization);

        if(!decodedToken){
            return res.status(401).json({ error: "token is missing or invalid" });
        }

        const [existingMatches] = await pool.query(
        `SELECT
            CONCAT(u1.nombre, ' ', u1.apellido1, ' - ', u2.nombre, ' ', u2.apellido1) AS couple1,
            CONCAT(u3.nombre, ' ', u3.apellido1, ' - ', u4.nombre, ' ', u4.apellido1) AS couple2,
            p.fecha AS date,
            IFNULL(t.nombre, 'Sin torneo') AS tournament
        FROM partidos p
        JOIN parejas pa1 ON p.id_pareja1 = pa1.id_pareja
        JOIN parejas pa2 ON p.id_pareja2 = pa2.id_pareja
        JOIN usuarios u1 ON pa1.id_usuario1 = u1.id
        JOIN usuarios u2 ON pa1.id_usuario2 = u2.id
        JOIN usuarios u3 ON pa2.id_usuario1 = u3.id
        JOIN usuarios u4 ON pa2.id_usuario2 = u4.id
        LEFT JOIN torneos t ON p.id_torneo = t.id_torneo;`,
        );

        return res.send(existingMatches)
    }

    export const createMatch = async (req, res) => {
        const authorization = req.get('authorization');
        const decodedToken = getAuthorizationToken(authorization);

        if(!decodedToken){
            return res.status(401).json({ error: "token is missing or invalid" });
        }

        const {
            usuario1,
            usuario2,
            usuario3,
            usuario4,
            torneo,
            fecha
        } = req.body

        console.log(`INSERT INTO parejas (id_usuario1, id_usuario2)
        VALUES (${usuario1}, ${usuario2})
        ON DUPLICATE KEY UPDATE id_usuario1 = id_usuario1;
        
        SELECT id_pareja FROM parejas
        WHERE (id_usuario1 = ${usuario1} AND id_usuario2 = ${usuario2})
           OR (id_usuario1 = ${usuario2} AND id_usuario2 = ${usuario1});`)

        try{
            // Si no existe la pareja se crea
            const [createCouple1] = await pool.query(
                `INSERT INTO parejas (id_usuario1, id_usuario2)
                VALUES (${usuario1}, ${usuario2})
                ON DUPLICATE KEY UPDATE id_usuario1 = id_usuario1;`);
            
            // Obtenemos el id de la primera pareja
            const [couple1] = await pool.query(
                `SELECT id_pareja FROM parejas
                WHERE (id_usuario1 = ${usuario1} AND id_usuario2 = ${usuario2})
                   OR (id_usuario1 = ${usuario2} AND id_usuario2 = ${usuario1});`);

            // Si no existe la pareja se crea
            const [createCouple2] = await pool.query(
                `INSERT INTO parejas (id_usuario1, id_usuario2)
                VALUES (${usuario3}, ${usuario4})
                ON DUPLICATE KEY UPDATE id_usuario1 = id_usuario1;`);
            
            // Obtenemos el id de la primera pareja
            const [couple2] = await pool.query(
                `SELECT id_pareja FROM parejas
                WHERE (id_usuario1 = ${usuario3} AND id_usuario2 = ${usuario4})
                   OR (id_usuario1 = ${usuario4} AND id_usuario2 = ${usuario3});`);
                        
            const [rows] = await pool.query(
                'INSERT INTO partidos (id_pareja1, id_pareja2, id_torneo, fecha) VALUES (?,?,?,?)',
                [couple1[0].id_pareja, couple2[0].id_pareja, torneo, fecha]
            );
        } catch(error){
            console.log(error)
            return res.status(500).json({
                message:'Algo ha ido mal.'
            })
        }

        res.send("Se ha creado el partido");
    }