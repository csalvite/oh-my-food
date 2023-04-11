const getDB = require('../../database/getDB');
const generateError = require('../../utils/generateError');

const userAddress = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { street, city, cp, province, country } = req.body;

    if (!(street && cp && province && country)) {
      throw generateError('Faltan campos obligatorios.', 400);
    }

    await connection.query(
      `insert into addresses (street, cp, province, country, idUser)
        values (?, ?, ?, ?, ?)`,
      [street, cp, province, country, req.userAuth.id]
    );

    res.send({
      status: 'ok',
      message: '¡Dirección añadida con éxito!',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = userAddress;
