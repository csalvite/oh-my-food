const getDB = require('../database/getDB');
const jwt = require('jsonwebtoken');
const generateError = require('../utils/generateError');

const isAuth = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Obtenemos la cabecera de autorización (el token).
    const { authorization } = req.headers;

    // Si no hay cabecera de autorización lanzamos un error.
    if (!authorization) {
      throw generateError('Falta la cabecera de autorización', 401);
    }

    // Variable que almacenará la información del token.
    let tokenInfo = jwt.verify(authorization, process.env.SECRET);

    if (!tokenInfo) {
      throw generateError('No has iniciado sesión.', 401);
    }
    // try {
    //   // Desencriptamos el token.
    //   tokenInfo = jwt.verify(authorization, process.env.SECRET);
    // } catch (_) {
    //   const error = new Error('No has iniciado sesión.');
    //   error.httpStatus = 401;
    //   throw error;
    // }

    // Seleccionamos el usuario con el id que viene del token.
    const [user] = await connection.query(
      `SELECT active FROM User WHERE id = ?`,
      [tokenInfo.id]
    );

    // Si el usuario no está activado.
    if (!user[0].active || user.length < 1) {
      throw generateError(
        'El token no es válido o el usuario no está activo, revisa tu correo',
        401
      );
    }

    req.userAuth = tokenInfo;

    // Pasamos la pelota al siguiente middleware.
    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = isAuth;
