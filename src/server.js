const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const cors = require('cors');
const app = express();

const { PORT } = process.env;

app.use(cors());
app.use(morgan('dev')); // Desserializa body en formato raw
app.use(express.json());

/**
 * #########################
 * ### Users Controllers ###
 * #########################
 */

const { newUser, validateUser, loginUser } = require('./controllers/users');

/**
 * #######################
 * ### Users Endpoints ###
 * #######################
 */

// Registro usuario
app.post('/register', newUser);

// Validar registro
app.post('/register/:registrationCode', validateUser);

// Login usuario
app.post('/login', loginUser);

/*
  #####################################
  ### Middlewares Error y Not Found ###
  #####################################
*/

app.use((error, req, res, _) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: 'Error',
    message: error.message,
  });
});

// Middleware not found

app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not Found',
  });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
