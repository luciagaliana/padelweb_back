import {pool} from '../db.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const loginUser = async (req, res) => {
  try {
    const { correo, contrasenya } = req.body;

    // Verificar si el usuario existe
    const [existingUsers] = await pool.query(
      'SELECT * FROM usuarios WHERE correo = ?',
      [correo]
    );

    if (existingUsers.length == 0 ) {
      // Usuario no encontrado, enviar mensaje de error
      return res.status(400).send('No existe un usuario con ese correo.');
    }

    const user = existingUsers[0];

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(contrasenya, user.contrasenya);

    if (!passwordMatch) {
      // Contraseña incorrecta, enviar mensaje de error
      return res.status(400).send('Contraseña incorrecta.');
    }

    // Generar token JWT
    const token = jwt.sign(user, 'secretKey', {expiresIn: '1d'});
    res.cookie('token', token)

    // Usuario y contraseña correctos
    res.status(200).send('El incio de sesión se ha realizado correctamente.');

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Algo ha ido mal.'
    });
  }
};

export const getUsers  =  async (req,res)=>{
  const authorization = req.get('authorization');
  const decodedToken = getAuthorizationToken(authorization);

  if(!decodedToken){
      return res.status(401).json({ error: "token is missing or invalid" });
  }

  const [users] = await pool.query(
      'SELECT * FROM usuarios')
  res.send({users})
};

export const createUser = async (req, res) => {
  try {
    const {
      id,
      nombre,
      apellido1,
      apellido2,
      correo,
      contrasenya,
      genero,
      propietario,
      edificio,
      escalera,
      piso,
      letra,
      admin
    } = req.body;

    // Verificar si el usuario ya existe
    const [existingUsers] = await pool.query(
      'SELECT * FROM usuarios WHERE correo = ?', [correo]
    );
    const hashedPassword = await bcrypt.hash(contrasenya, 10);

    if (existingUsers.length > 0) {
      // Usuario existente, enviar mensaje de error
      return res.status(400).send("Ya existe un usuario con ese correo.");
    }

    //Si todo ha ido bien insertamos el nuevo usuario en la tabla users de la bd
    const [rows] = await pool.query(
      'INSERT INTO users (id, nombre, apellido1, apellido2, correo, contrasenya, genero, propietario, edificio, escalera, piso, letra, admin) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [id, nombre, apellido1, apellido2, correo, hashedPassword, genero, propietario, edificio, escalera, piso, letra, admin]
    );
    
    //QUITAR AL TERMINAR TRABAJO
    console.log(req.body);
    res.send("Se ha registrado el nuevo usuario");

  } catch (error) {
    return res.status(500).json({
        message:'Algo ha ido mal.'
    })
  }
};

export const editUser = (req,res)=>res.send('actualizando usuarios');

export const deleteUser = (req,res)=>res.send('eliminando usuarios');