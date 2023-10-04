import {Router} from 'express'
import { 
    getUsers, 
    createUser, 
    editUser, 
    deleteUser, 
    loginUser,
    authUser, 
} from '../controllers/users.controllers.js'
import jwt from 'jsonwebtoken';

const router = Router()

//Ruta para el inicio de sesión
router.post('/login', loginUser); 

//Ruta para autenticar al usuario
router.get('/auth', authUser);

//Ruta para deslogear al usuario
//router.get('/logout', logOutUser);

//Ruta para obtener los usuarios
router.get('/users', getUsers);

router.post('/users', createUser)

router.put('/users', editUser)

router.delete('/users', deleteUser)


export default router