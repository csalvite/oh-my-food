const getDB = require('../../database/getDB');
const generateError = require('../../utils/generateError');

const validateUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { registrationCode } = req.params;

    // Si NO existe un usuario pendiente de validar con ese código de registro lanzamos un error
    const [user] = await connection.query(
      `select * from Users where registrationCode = ?`,
      [registrationCode]
    );

    if (user.length < 1) {
      throw generateError(
        'El usuario ya está activado o el código no es válido.',
        409
      );
    }

    // Si están todos los datos obligatorios, actualizamos el usuario final
    await connection.query(
      `update Users set active = 1, registrationCode = null where registrationCode = ?`,
      [registrationCode]
    );

    res.send({
      status: 'ok',
      message: '¡Usuario activado!',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = validateUser;
