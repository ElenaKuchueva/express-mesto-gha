const express = require('express');

const { PORT = 3000 } = process.env;
const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
const aboutUserRouter = require('./routes/users');
const aboutCardRouter = require('./routes/cards');
const { STATUS_NOT_FOUND } = require('./utils/err');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64b5150b32c292829a7f54b9',
  };
  next();
});

app.use('/users', aboutUserRouter);
app.use('/cards', aboutCardRouter);
app.use('*', (req, res) => {
  res.status(STATUS_NOT_FOUND).json({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
