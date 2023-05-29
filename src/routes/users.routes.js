import {Router} from 'express'
import { getUsers , createUser, editUser, deleteUser} from '../controllers/users.controllers.js'

const router = Router()

router.get('/users', getUsers);

router.post('/users', createUser)

router.put('/users', editUser)

router.delete('/users', deleteUser)


export default router