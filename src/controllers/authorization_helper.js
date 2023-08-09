import bcrypt from 'bcrypt';
    import jwt from 'jsonwebtoken';
    // Recibe como entrada la request y response
    // Devuelve:
    //  null --> Si no hay token o el token no es correcto
    //  decodedToken --> Si el tóken es corrécto
    // ATENCIÓN: Se deberá hacer una comprobación de si el valor devuelto es null, en ese caso
    // se deberá detener la ejecución del método ya que el usuario no estará autenticado.
    export const getAuthorizationToken = (authorization) => {
        if (authorization && authorization.toLowerCase().startsWith('bearer')) {
            const token = authorization.substring(7);
            try {
                const decodedToken = jwt.verify(token, "secretKey");
                return decodedToken;
            } catch (error) {
                return null;
            }
        }
        return null;
    }