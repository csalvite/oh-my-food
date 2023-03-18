/**
 * #################
 * ## verifyEmail ##
 * #################
 */

const { sendMail } = require('./sendMail');

const { FRONT_HOST } = process.env;

// ${PUBLIC_HOST}/users/register/${registrationCode}
async function verifyEmail(email, registrationCode) {
  const emailBody = `
  <h2> Te acabas de registrar en EMUVI </h2>
  <p> Pulsa sobre la imagen para verificar tu cuenta: </p>
  <a href=${FRONT_HOST}/validate/${registrationCode}><img src="https://i.ibb.co/gVYWWKb/Bienvenido-EMUVI.png" alt="Bienvenido-EMUVI" width="500" border="0"></a>
  `;

  //Enviamos el mensaje al correo del usuario.
  await sendMail({
    to: email,
    subject: 'Activa tu cuenta',
    body: emailBody,
  });
}

module.exports = { verifyEmail };
