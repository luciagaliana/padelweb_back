    import {pool} from '../db.js'
    import { getAuthorizationToken } from './authorization_helper.js';

    export const getTournament = async (req, res) =>{
        const authorization = req.get('authorization');
        const decodedToken = getAuthorizationToken(authorization);

        if(!decodedToken){
            return res.status(401).json({ error: "token is missing or invalid" });
        }

        const [responseTournaments] = await pool.query(
            `SELECT
            id_torneo as options,
            nombre AS name,
            CASE
              WHEN fecha_ini > CURDATE() THEN 'No disputado'
              WHEN fecha_ini <= CURDATE() AND fecha_fin >= CURDATE() THEN 'En curso'
              ELSE 'Finalizado'
            END AS status,
            CONCAT('Del ', DATE_FORMAT(fecha_ini, '%d/%m/%Y'), ' al ', DATE_FORMAT(fecha_fin, '%d/%m/%Y')) AS date,
            CASE
              WHEN fecha_ini > CURDATE() THEN 0
              WHEN fecha_ini <= CURDATE() AND fecha_fin >= CURDATE() THEN 50
              ELSE 100
            END AS progress
          FROM torneos;
          `,
        );

        res.send(responseTournaments);
        
    }

    export const getTournamentUser = async(req, res) => {
    }

    export const createTournament = async(req, res) => {
      try{
          const authorization = req.get('authorization');
          const decodedToken = getAuthorizationToken(authorization);

          if(!decodedToken){
              return res.status(401).json({ error: "token is missing or invalid" });
          }

          const {
            nombre,
            puntos,
            tipo,
            fechaInicio,
            fechaFin
          } = req.body;

          
          // Verificar si el usuario ya existe
          const [existingTournament] = await pool.query(
            'SELECT * FROM torneos WHERE nombre = ?', [nombre]
          );
          
          if (existingTournament.length > 0) {
            // Usuario existente, enviar mensaje de error
            return res.status(400).send("Ya existe un torneo con este nombre.");
          }
    
          const [rows] = await pool.query(
            'INSERT INTO torneos (nombre, tipo, fecha_ini, fecha_fin, puntos) VALUES (?,?,?,?,?)',
            [nombre, tipo, fechaInicio, fechaFin, puntos]
          );
    
          res.send("Se ha creado el torneo");
        }catch(error){
          console.log(error)
          return res.status(500).json({
              message:'Algo ha ido mal.'
          })
        }
    }

    export const deleteTournament = async(req, res) => {
      try{

        const authorization = req.get('authorization');
        const decodedToken = getAuthorizationToken(authorization);

        if(!decodedToken){
          return res.status(401).json({ error: "token is missing or invalid" });
        }

        const{idTournament} = req.body

        const [rows] = await pool.query(
          'DELETE FROM torneos WHERE id_torneo = ?;', [idTournament]
        );

        res.send("Se ha eliminado el torneo con ID " + idTournament);

      } catch(error){
        console.log(error)
        return res.status(500).json({
          message:'Algo ha ido mal.'
      }) 
      }
    }

