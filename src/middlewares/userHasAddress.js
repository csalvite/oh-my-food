const getDB = require('../database/getDB');
const generateError = require('../utils/generateError');

const userHasAddress = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Para que el usuario pueda realizar un pedido vamos a comprobar que al menos tenga una dirección
    const [address] = await connection.query(
      `select * from Addresses where idUser = ?`,
      [req.userAuth.id]
    );

    if (address.length < 1) {
      throw generateError(
        'Para poder realizar un pedido es necesario tener asociada al menos una dirección a tu cuenta.',
        403
      );
    }

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = userHasAddress;
