const express = require('express');
const path = require('path');
const { error } = require('../middlewares/error');
const router = require('../routes');

const app = express();
app.use(express.json());

app.use(express.static(path.resolve(__dirname, '..', 'uploads')));

app.get('/', (request, response) => {
  response.send();
});

app.use(router);
app.use(error);

module.exports = app;
