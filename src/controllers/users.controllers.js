import {pool} from '../db.js'


export const getUsers  =  async (req,res)=>{
    const [rows] = await pool.query(
        'SELECT * FROM users')
    res.send({rows})
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
      'SELECT * FROM users WHERE correo = ?', [correo]
    );

    if (existingUsers.length > 0) {
      // Usuario existente, enviar mensaje de error
      return res.status(400).send("Ya existe un usuario con ese correo.");
    }

    const [rows] = await pool.query(
      'INSERT INTO users (id, nombre, apellido1, apellido2, correo, contrasenya, genero, propietario, edificio, escalera, piso, letra, admin) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [id, nombre, apellido1, apellido2, correo, contrasenya, genero, propietario, edificio, escalera, piso, letra, admin]
    );
    
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