    import {pool} from '../db.js'
    import { getAuthorizationToken } from './authorization_helper.js';

    // Obtiene el ranking individual de todos los modos (masculino, femenino y mixto)
    export const getRanking_single = async (req, res) =>{
        
        const authorization = req.get('authorization');
        const decodedToken = getAuthorizationToken(authorization);

        if(!decodedToken){
            return res.status(401).json({ error: "token is missing or invalid" });
        }

        const [responseRankingSingleMale] = await pool.query(
        `SELECT id_ranking_i, id_usuario, puntos,
            (SELECT COUNT(*) + 1
            FROM ranking_individualMasculino AS rp2
            WHERE rp2.puntos > rp1.puntos OR (rp2.puntos = rp1.puntos AND rp2.id_ranking_i < rp1.id_ranking_i)
            ) AS posicion
        FROM ranking_individualMasculino AS rp1
        ORDER BY puntos DESC;`,
        );

        const rankingSingleMale = responseRankingSingleMale.map((obj) => ({
            ...obj,
            tipo: "Masculino"
        }));
         
        const [responseRankingSingleFemale] = await pool.query(
            `SELECT id_ranking_i, id_usuario, puntos,
                (SELECT COUNT(*) + 1
                FROM ranking_individualFemenino AS rp2
                WHERE rp2.puntos > rp1.puntos OR (rp2.puntos = rp1.puntos AND rp2.id_ranking_i < rp1.id_ranking_i)
                ) AS posicion
            FROM ranking_individualFemenino AS rp1
            ORDER BY puntos DESC;`,
            );
    
        const rankingSingleFemale = responseRankingSingleFemale.map((obj) => ({
            ...obj,
            tipo: "Femenino"
        }));

        const [responseRankingSingleMixed] = await pool.query(
            `SELECT id_ranking_i, id_usuario, puntos,
                (SELECT COUNT(*) + 1
                FROM ranking_individualMixto AS rp2
                WHERE rp2.puntos > rp1.puntos OR (rp2.puntos = rp1.puntos AND rp2.id_ranking_i < rp1.id_ranking_i)
                ) AS posicion
            FROM ranking_individualMixto AS rp1
            ORDER BY puntos DESC;`,
            );
    
        const rankingSingleMixed = responseRankingSingleMixed.map((obj) => ({
            ...obj,
            tipo: "Mixto"
        }));

        const rankingSingle = [...rankingSingleMale, ...rankingSingleFemale, ...rankingSingleMixed]

        return res.send(rankingSingle)
    }

    // Obtiene el ranking por parejas de todos los modos (masculino, femenino y mixto)
    export const getRanking_couple = async (req, res) =>{
        const authorization = req.get('authorization');
        const decodedToken = getAuthorizationToken(authorization);

        if(!decodedToken){
            return res.status(401).json({ error: "token is missing or invalid" });
        }
        
        const [responseRankingCoupleMale] = await pool.query(
        `SELECT id_ranking_p, id_pareja, puntos,
            (SELECT COUNT(*) + 1
            FROM ranking_parejasmasculino AS rp2
            WHERE rp2.puntos > rp1.puntos OR (rp2.puntos = rp1.puntos AND rp2.id_ranking_p < rp1.id_ranking_p)
            ) AS posicion
        FROM ranking_parejasmasculino AS rp1
        ORDER BY puntos DESC;`,
        );

        const rankingCoupleMale = responseRankingCoupleMale.map((obj) => ({
            ...obj,
            tipo: "Masculino"
        }));
            
        const [responseRankingCoupleFemale] = await pool.query(
            `SELECT id_ranking_p, id_pareja, puntos,
                (SELECT COUNT(*) + 1
                FROM ranking_parejasFemenino AS rp2
                WHERE rp2.puntos > rp1.puntos OR (rp2.puntos = rp1.puntos AND rp2.id_ranking_p < rp1.id_ranking_p)
                ) AS posicion
            FROM ranking_parejasFemenino AS rp1
            ORDER BY puntos DESC;`,
            );
    
        const rankingCoupleFemale = responseRankingCoupleFemale.map((obj) => ({
            ...obj,
            tipo: "Femenino"
        }));

        const [responseRankingCoupleMixed] = await pool.query(
            `SELECT id_ranking_p, id_pareja, puntos,
                (SELECT COUNT(*) + 1
                FROM ranking_parejasMixto AS rp2
                WHERE rp2.puntos > rp1.puntos OR (rp2.puntos = rp1.puntos AND rp2.id_ranking_p < rp1.id_ranking_p)
                ) AS posicion
            FROM ranking_parejasMixto AS rp1
            ORDER BY puntos DESC;`,
            );
    
        const rankingCoupleMixed = responseRankingCoupleMixed.map((obj) => ({
            ...obj,
            tipo: "Mixto"
        }));

        const rankingCouple = [...rankingCoupleMale, ...rankingCoupleFemale, ...rankingCoupleMixed]

        return res.send(rankingCouple)
        
    }

    // Obtiene el ranking individual de un usuario en concreto en todos los modos (masculino, femenino y mixto)
    export const getRankingUser_individual = async (req, res) =>{
        const authorization = req.get('authorization');
        const decodedToken = getAuthorizationToken(authorization);

        if(!decodedToken){
            return res.status(401).json({ error: "token is missing or invalid" });
        }

        const userId = decodedToken.id;
        const userGenre = decodedToken.genero;
        
        let tableName;
        let genre;
        if (userGenre === 1) {
            tableName = 'ranking_individualmasculino';
            genre = "Masculino"
        } else {
            tableName = 'ranking_individualfemenino';
            genre = "Femenino"
        }

        // Consulta SQL utilizando la variable tableName
        const [responseRankingGenre] = await pool.query(
            `SELECT id_usuario, puntos,
                (SELECT COUNT(*) + 1
                FROM ${tableName} AS rf2
                WHERE rf2.puntos > rf1.puntos OR (rf2.puntos = rf1.puntos AND rf2.id_ranking_i < rf1.id_ranking_i)
                ) AS posicion
            FROM ${tableName} AS rf1
            WHERE id_usuario = ? 
            ORDER BY puntos DESC;`,
            [userId]
        );

        const rankingGenre = responseRankingGenre[0];
        rankingGenre.tipo = genre;

        const [responseRankingMixed] = await pool.query(
            `SELECT id_usuario,puntos,
                (SELECT COUNT(*) + 1 
                FROM ranking_individualmixto AS rf2 
                WHERE rf2.puntos > rf1.puntos OR (rf2.puntos = rf1.puntos AND rf2.id_ranking_i < rf1.id_ranking_i)
                ) AS posicion 
            FROM ranking_individualmixto AS rf1 
            WHERE id_usuario = ? 
            ORDER BY puntos DESC;`,
            [userId]
        );

        const rankingMixed = responseRankingMixed[0];
        rankingMixed.tipo = "Mixto"
        
        res.send([rankingGenre, rankingMixed])
    }

    // Obtiene el ranking por parejas de un usuario en concreto en todos los modos (masculino, femenino y mixto)
    export const getRankingUser_couple = async (req, res) =>{
        const authorization = req.get('authorization');
        const decodedToken = getAuthorizationToken(authorization);

        if(!decodedToken){
            return res.status(401).json({ error: "token is missing or invalid" });
        }

        const userId = decodedToken.id;
        const userGenre = decodedToken.genero;

        //Selecciona el id_pareja 
        const [existingCouples] = await pool.query(
            `SELECT id_pareja
            FROM parejas
            WHERE id_usuario1=${userId} OR id_usuario2=${userId}`
        );

        let tableName;
        let genre;
        if (userGenre === 1) {
            tableName = 'ranking_parejasmasculino';
            genre = "Masculino"
        } else {
            tableName = 'ranking_parejasfemenino';
            genre = "Femenino"
        }
        
        const idCouples = existingCouples.map((pareja) => pareja.id_pareja).join(',');

        // Consulta SQL utilizando la variable tableName
        const [responseRankingGenre] = await pool.query(
            `SELECT 
                id_pareja,
                puntos,
                (SELECT COUNT(*) + 1
                FROM ${tableName} AS rp2
                WHERE rp2.puntos > rp1.puntos OR (rp2.puntos = rp1.puntos AND rp2.id_ranking_p < rp1.id_ranking_p)
                ) AS posicion
            FROM ${tableName} AS rp1
            WHERE id_pareja IN (${idCouples}) 
            ORDER BY puntos DESC;`
        );

        const rankingGenre = responseRankingGenre.map((obj) => ({
            ...obj,
            tipo: genre
         }));

        // Consulta SQL utilizando la variable tableName
        const [responseRankingMixed] = await pool.query(
            `SELECT 
                id_pareja,
                puntos,
                (SELECT COUNT(*) + 1
                FROM ranking_parejasmixto AS rp2
                WHERE rp2.puntos > rp1.puntos OR (rp2.puntos = rp1.puntos AND rp2.id_ranking_p < rp1.id_ranking_p)
                ) AS posicion
            FROM ranking_parejasmixto AS rp1
            WHERE id_pareja IN (${idCouples}) 
            ORDER BY puntos DESC;`
        );

        const rankingMixed = responseRankingMixed.map((obj) => ({
            ...obj,
            tipo: "Mixto"
          }));

        const rankingCouple = rankingGenre.concat(rankingMixed);

        res.send(rankingCouple)
    }

    //Obtiene el ranking individual y por parejas de un usuario en todos los modos a corde con la tabla del frontend
    export const getRankingUserTable = async (req,res) => {
        const authorization = req.get('authorization');
        const decodedToken = getAuthorizationToken(authorization);

        if(!decodedToken){
            return res.status(401).json({ error: "token is missing or invalid" });
        }

        const userId = decodedToken.id;
        const userGenre = decodedToken.genero;
        
        let tableNameIndividual;
        let tableNameCouple;
        let genre;
        if (userGenre === 1) {
            tableNameIndividual = 'ranking_individualmasculino';
            tableNameCouple = 'ranking_parejasmasculino';
            genre = "Masculino"
        } else {
            tableNameIndividual = 'ranking_individualfemenino';
            tableNameCouple = 'ranking_parejasfemenino';
            genre = "Femenino"
        }

        const [responseRankingGenreIndividual] = await pool.query(
            `SELECT puntos AS points,
                (SELECT COUNT(*) + 1
                FROM ${tableNameIndividual} AS rf2
                WHERE rf2.puntos > rf1.puntos OR (rf2.puntos = rf1.puntos AND rf2.id_ranking_i < rf1.id_ranking_i)
                ) AS position
            FROM ${tableNameIndividual} AS rf1
            WHERE id_usuario = ? 
            ORDER BY puntos DESC;`,
            [userId]
        );

        const rankingGenreIndividual = responseRankingGenreIndividual[0];
        rankingGenreIndividual.gender = genre;

        const [responseRankingMixedIndividual] = await pool.query(
            `SELECT puntos as points,
                (SELECT COUNT(*) + 1 
                FROM ranking_individualmixto AS rf2 
                WHERE rf2.puntos > rf1.puntos OR (rf2.puntos = rf1.puntos AND rf2.id_ranking_i < rf1.id_ranking_i)
                ) AS position 
            FROM ranking_individualmixto AS rf1 
            WHERE id_usuario = ? 
            ORDER BY puntos DESC;`,
            [userId]
        );

        const rankingMixedIndividual = responseRankingMixedIndividual[0];
        rankingMixedIndividual.gender = "Mixto"
        
        let rankingUserIndividual = [rankingGenreIndividual, rankingMixedIndividual]

        rankingUserIndividual = rankingUserIndividual.map((obj) => ({
            ...obj,
            category: "Individual"
         }));

        const [existingCouples] = await pool.query(
            `SELECT id_pareja
            FROM parejas
            WHERE id_usuario1=${userId} OR id_usuario2=${userId}`
        );

        // Si no tiene parejas
        if(existingCouples.length === 0){
            return res.send(rankingUserIndividual)
        }

        const idCouples = existingCouples.map((pareja) => pareja.id_pareja).join(',');

        let rankingUserCouple = [];

        try{
            // Consulta SQL utilizando la variable tableName
            const [responseRankingGenreCouple] = await pool.query(
                `SELECT 
                    puntos as points,
                    (SELECT COUNT(*) + 1
                    FROM ${tableNameCouple} AS rp2
                    WHERE rp2.puntos > rp1.puntos OR (rp2.puntos = rp1.puntos AND rp2.id_ranking_p < rp1.id_ranking_p)
                    ) AS position
                FROM ${tableNameCouple} AS rp1
                WHERE id_pareja IN (${idCouples}) 
                ORDER BY puntos DESC;`
            );

            const rankingGenreCouple = responseRankingGenreCouple.map((obj) => ({
                ...obj,
                gender: genre,
                category: "Por parejas"
            }));

            rankingUserCouple = rankingGenreCouple;
        } catch(error){
            console.log("No tiene parejas de ", genre)
        }

        try{
            // Consulta SQL utilizando la variable tableName
            const [responseRankingMixedCouple] = await pool.query(
                `SELECT 
                    puntos as points,
                    (SELECT COUNT(*) + 1
                    FROM ranking_parejasmixto AS rp2
                    WHERE rp2.puntos > rp1.puntos OR (rp2.puntos = rp1.puntos AND rp2.id_ranking_p < rp1.id_ranking_p)
                    ) AS position
                FROM ranking_parejasmixto AS rp1
                WHERE id_pareja IN (${idCouples}) 
                ORDER BY puntos DESC;`
            );

            const rankingMixedCouple = responseRankingMixedCouple.map((obj) => ({
                ...obj,
                gender: "Mixto",
                category: "Por parejas"
            }));

            rankingUserCouple = rankingUserCouple.cocnat(rankingMixedCouple)
        } catch(error){
            console.log("No tiene parejas de Mixto")
        }

        const rankingUser = rankingUserIndividual.concat(rankingUserCouple);

        return res.send(rankingUser)
    }

    //Obtiene el ranking individual y por parejas en todos los modos a corde con la tabla del frontend
    export const getRankingTable = async (req,res) => {
        const authorization = req.get('authorization');
        const decodedToken = getAuthorizationToken(authorization);

        if(!decodedToken){
            return res.status(401).json({ error: "token is missing or invalid" });
        }

        let rankingTableIndividual = [];

        const [responseRankingSingleMale] = await pool.query(
            `SELECT 
                RANK() OVER (ORDER BY puntos DESC) AS position,
                nombre AS player,
                puntos AS points
            FROM ranking_individualMasculino
            JOIN usuarios ON ranking_individualMasculino.id_usuario = usuarios.id;`
        );

        rankingTableIndividual = rankingTableIndividual.concat(responseRankingSingleMale.map((obj) => ({
            ...obj,
            gender: "Masculino",
            category: "Individual"
            
        }))) 

        const [responseRankingSingleFemale] = await pool.query(
            `SELECT 
                RANK() OVER (ORDER BY puntos DESC) AS position,
                nombre AS player,
                puntos AS points
            FROM ranking_individualFemenino
            JOIN usuarios ON ranking_individualFemenino.id_usuario = usuarios.id;`
        );

        rankingTableIndividual = rankingTableIndividual.concat(responseRankingSingleFemale.map((obj) => ({
            ...obj,
            gender: "Femenino",
            category: "Individual"
            
        }))) 
        

        const [responseRankingSingleMixed] = await pool.query(
            `SELECT 
                RANK() OVER (ORDER BY puntos DESC) AS position,
                nombre AS player,
                puntos AS points
            FROM ranking_individualmixto
            JOIN usuarios ON ranking_individualmixto.id_usuario = usuarios.id;`
        );

        rankingTableIndividual = rankingTableIndividual.concat(responseRankingSingleMixed.map((obj) => ({
            ...obj,
            gender: "Mixto",
            category: "Individual"
            
        })))

        
        let rankingTableCouple = [];

        const [responseRankingCoupleMale] = await pool.query(
            `SELECT 
                RANK() OVER (ORDER BY rp.puntos DESC) AS position,
                CONCAT(u1.nombre, '-', u2.nombre) AS player,
                rp.puntos AS points
            FROM ranking_parejasmasculino rp
            JOIN parejas p ON rp.id_pareja = p.id_pareja
            JOIN usuarios u1 ON p.id_usuario1 = u1.id
            JOIN usuarios u2 ON p.id_usuario2 = u2.id;`
        );

        rankingTableCouple = rankingTableCouple.concat(responseRankingCoupleMale.map((obj) => ({
            ...obj,
            gender: "Masculino",
            category: "Por parejas"
            
        }))) 

        const [responseRankingCoupleFemale] = await pool.query(
            `SELECT 
                RANK() OVER (ORDER BY rp.puntos DESC) AS position,
                CONCAT(u1.nombre, '-', u2.nombre) AS player,
                rp.puntos AS points
            FROM ranking_parejasfemenino rp
            JOIN parejas p ON rp.id_pareja = p.id_pareja
            JOIN usuarios u1 ON p.id_usuario1 = u1.id
            JOIN usuarios u2 ON p.id_usuario2 = u2.id;`
        );

        rankingTableCouple = rankingTableCouple.concat(responseRankingCoupleFemale.map((obj) => ({
            ...obj,
            gender: "Femenino",
            category: "Por parejas"
            
        }))) 
        

        const [responseRankingCoupleMixed] = await pool.query(
            `SELECT 
                RANK() OVER (ORDER BY rp.puntos DESC) AS position,
                CONCAT(u1.nombre, '-', u2.nombre) AS player,
                rp.puntos AS points
            FROM ranking_parejasmixto rp
            JOIN parejas p ON rp.id_pareja = p.id_pareja
            JOIN usuarios u1 ON p.id_usuario1 = u1.id
            JOIN usuarios u2 ON p.id_usuario2 = u2.id;`
        );

        rankingTableCouple = rankingTableCouple.concat(responseRankingCoupleMixed.map((obj) => ({
            ...obj,
            gender: "Mixto",
            category: "Por parejas"
            
        })))

        let rankingTable = rankingTableCouple.concat(rankingTableIndividual)


        res.send(rankingTable)
    }