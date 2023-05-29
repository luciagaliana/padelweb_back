import {config} from 'dotenv'

config()

//Este puerto es el del servidor
export const PORT = process.env.PORT || 3001

export const DB_HOST = process.env.DB_HOST || 'localhost'
//Este puerto es de la base de datos
export const DB_PORT = process.env.DB_PORT || '3334'
export const DB_USER = process.env.DB_USER || 'root'
export const DB_PASSWORD = process.env.DB_PASSWORD || 'TFGlucia2023!'
export const DB_DATABASE = process.env.DB_DATABASE || 'padelweb'