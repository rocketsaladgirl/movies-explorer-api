require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const limiter = require('./middlewares/rateLimit');

const router = require('./routes/index');

const handleError = require('./middlewares/handelError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { baseUrl } = require('./utils/option');

const { NODE_ENV, MONGO_URL } = process.env;

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());
app.use(helmet());

app.use(express.json());

app.use(requestLogger);
app.use(limiter);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(handleError);

async function start() {
  try {
    await mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : baseUrl);
    await app.listen(PORT);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

start()
  // eslint-disable-next-line no-console
  .then(() => console.log(`Приложение успешно запущенно!\n${MONGO_URL}\nPort: ${PORT}`));
