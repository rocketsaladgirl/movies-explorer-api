require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require('cookie-parser');
const limiter = require('./middlewares/rateLimit');

const router = require('./routes/index');

const handleError = require('./middlewares/handelError');
const { requestLogger } = require('./middlewares/logger');

const { corsOptions } = require('./utils/constants');

const { MONGO_URL } = process.env;

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

mongoose.connect(MONGO_URL, {});

app.use(requestLogger);
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(limiter);

app.use('/', router);

app.use(handleError);

app.listen(PORT, () => {});
