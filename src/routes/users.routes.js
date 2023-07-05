import {Router} from 'express'
import { 
    getUsers, 
    createUser, 
    editUser, 
    deleteUser, 
    loginUser, 
} from '../controllers/users.controllers.js'
import jwt from 'jsonwebtoken';

const router = Router()

//Ruta para el inicio de sesión
router.post('/login', loginUser); 

//Ruta para autenticar al usuario
router.get('/auth', async (req, res, next) => {
    const authorization = req.get('authorization')

    let token = null;

    if (authorization && authorization.toLowerCase().startsWith('bearer')){
        token = authorization.substring(7)
    }

    let decodedToken = null
    try{
        decodedToken = jwt.verify(token, "secretKey")
    } catch {}

    if (!token || !decodedToken){
        return res.status(401).json({error: "token is missing or invalid"});
    }

    return res.status(200).json(decodedToken)
});

//Ruta para deslogear al usuario
//router.get('/logout', logOutUser);

router.get('/users', getUsers);

router.post('/users', createUser)

router.put('/users', editUser)

router.delete('/users', deleteUser)


export default router