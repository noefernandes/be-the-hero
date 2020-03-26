const express = require('express');
const cors = require('cors');

// O "./" é usado para arquivos.
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3333);