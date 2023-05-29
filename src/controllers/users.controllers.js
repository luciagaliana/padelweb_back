import {pool} from '../db.js'


export const getUsers  =  async (req,res)=>{
    const [rows] = await pool.query(
        'SELECT * FROM users')
    res.send({rows})
};

export const createUser = async (req,res)=>{
    const {id, nombre, apellido1, apellido2, correo, contraseña, género, propietario, edificio, escalera, piso, letra, admin} = req.body
    const [rows] = await pool.query(
        'INSERT INTO users (id, nombre, apellido1, apellido2, correo, contraseña, género, propietario, edificio, escalera, piso, letra, admin) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [id, nombre, apellido1, apellido2, correo, contraseña, género, propietario, edificio, escalera, piso, letra, admin])
    console.log(req.body)
    res.send({rows})
};



export const editUser = (req,res)=>res.send('actualizando usuarios');

export const deleteUser = (req,res)=>res.send('eliminando usuarios');