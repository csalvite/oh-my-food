const sgMail = require('@sendgrid/mail');

const { SENDGRID_FROM, SENDGRID_API_KEY } = process.env;

//Asignamos el API Key a Sendgrind.
sgMail.setApiKey(SENDGRID_API_KEY);

/**
 * ##############
 * ## sendMail ##
 * ##############
 */

async function sendMail({ to, subject, body }) {
  try {
    //Preprar el mensaje
    const msg = {
      to,
      from: SENDGRID_FROM,
      subject,
      text: body,
      html: `<html>
                    <body>
                      <div style="text-align: center;">
                        <h1>${subject}</h1>
                        <p>${body}</p>
                      </div>
                    </body>
                  </html>`,
    };

    //enviamos el mensaje.
    await sgMail.send(msg);
  } catch (_) {
    throw new Error('Hubo un problema al enviar el email');
  }
}

module.exports = { sendMail };
