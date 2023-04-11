const getDB = require('../../database/getDB');
const generateError = require('../../utils/generateError');

const updateUserLocation = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { lat, lon } = req.body;

    if (!(lat && lon)) {
      throw generateError('Faltan datos.', 400);
    }

    await connection.query(`update Users set lat = ?, lon = ? where id = ?`, [
      lat,
      lon,
      req.userAuth.id,
    ]);

    res.send({
      status: 'ok',
      message: '¡Ubicación del usuario modificada con éxito!',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateUserLocation;
