const getDB = require('../../database/getDB');
const bcrypt = require('bcrypt');
const { generateRandomString } = require('../../utils/generateRandomString');
const { verifyEmail } = require('../../utils/emails/verifyMail');
const saltRounds = 10;

const newUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Obtenemos los campos necesarios del body.
    const { name, lastname, email, password, phone } = req.body;

    // Comprobamos que inserta todos los datos
    if (!(name && lastname && email && password)) {
      const error = new Error('Debes insertar todos los datos obligatorios');
      error.httpStatus = 403;
      throw error;
    }

    // Comprobamos si el email existe en la base de datos.
    const [user] = await connection.query(
      `SELECT id FROM Users WHERE email = ?`,
      [email]
    );

    // Si el email ya existe lanzamos un error.
    if (user.length > 0) {
      const error = new Error('Ya existe un usuario con ese email');
      error.httpStatus = 409;
      throw error;
    }

    // Creamos un código de registro de un solo uso.
    const registrationCode = generateRandomString(40); // generateRandomString(40);

    // Encriptamos la contraseña.
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Guardamos el usuario en la base de datos.
    await connection.query(
      `INSERT INTO Users (name, lastname, email, password, phone, registrationCode) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, lastname, email, hashedPassword, phone, registrationCode]
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
