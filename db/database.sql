
--CREAR TABLA USUARIOS

 USE padelweb;
  CREATE TABLE users (
  id INT PRIMARY KEY,
  nombre VARCHAR(50),
  apellido1 VARCHAR(50),
  apellido2 VARCHAR(50),
  correo VARCHAR(100),
  contraseña VARCHAR(255),
  género INT,
  propietario INT,
  edificio INT,
  escalera INT,
  piso INT,
  letra CHAR(1),
  admin INT
);


--INSERTAR USUARIOS
INSERT INTO users (id, nombre, apellido1, apellido2, correo, contraseña, género, propietario, edificio, escalera, piso, letra, admin)
VALUES
  (1, 'Juan', 'Pérez', 'Gómez', 'juan@example.com', 'contraseña1', 1, 1, 1, 3, 2, 'A', 1),
  (2, 'María', 'González', 'López', 'maria@example.com', 'contraseña2', 2, 0, 2, 5, 1, 'B', 0),
  (3, 'Pedro', 'Sánchez', 'Martínez', 'pedro@example.com', 'contraseña3', 1, 1, 3, 1, 0, 'C', 0);


{
    "id": 4,
    "nombre": "Julio",
    "apellido1": "Fernández",
    "apellido2": "Gómez",
    "correo": "julio@example.com",
    "contraseña": "contraseña1",
    "género": 1,
    "propietario": 1,
    "edificio": 1,
    "escalera": 3,
    "piso": 2,
    "letra": "A",
    "admin": 0
}