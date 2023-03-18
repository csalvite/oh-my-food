const getDB = require('../../database/getDB');
const bcrypt = require('bcrypt');
const { generateRandomString } = require('../../utils/generateRandomString');
const { verifyEmail } = require('../../utils/emails/verifyMail');
const generateError = require('../../utils/generateError');
const saltRounds = 10;

const newUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Obtenemos los campos necesarios del body.
    const { name, lastname, email, password, phone, lat, lon } = req.body;

    // Comprobamos que inserta todos los datos
    if (!(name && lastname && email && password)) {
      throw generateError('Debes insertar todos los datos obligatorios', 403);
    }

    // Comprobamos si el email existe en la base de datos.
    const [user] = await connection.query(
      `SELECT id FROM Users WHERE email = ?`,
      [email]
    );

    // Si el email ya existe lanzamos un error.
    if (user.length > 0) {
      throw generateError('Ya existe un usuario con ese email', 409);
    }

    // Creamos un código de registro de un solo uso.
    const registrationCode = generateRandomString(40); // generateRandomString(40);

    // Encriptamos la contraseña.
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Guardamos el usuario en la base de datos.
    await connection.query(
      `INSERT INTO Users (name, lastname, email, password, phone, registrationCode, lat, lon) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, lastname, email, hashedPassword, phone, registrationCode, lat, lon]
    );

    // Enviamos un mensaje de verificación al email del usuario.
    await verifyEmail(email, registrationCode);

    res.send({
      status: 'ok',
      message: 'Usuario registrado, comprueba tu email para activarlo',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newUser;
