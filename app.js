require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');

const router = require('./routes');

const handleError = require('./middlewares/handelError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { MONGO_URL, PORT = 3000 } = process.env;

const app = express();

app.use(cors());
app.use(helmet());

app.use(express.json());

app.use(requestLogger);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(handleError);

async function start() {
  try {
    await mongoose.connect(MONGO_URL);
    await app.listen(PORT);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

start()
  // eslint-disable-next-line no-console
  .then(() => console.log(`Приложение успешно запущенно!\n${MONGO_URL}\nPort: ${PORT}`));
