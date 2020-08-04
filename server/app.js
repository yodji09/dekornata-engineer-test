"use strict";
//if (process.env.NODE_ENV == 'development') {
  require('dotenv').config();
//}
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const errHandler = require('./middlewares/errHandler');
const router = require('./routes');

app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(router);
app.use(errHandler);

app.listen(port, () => {
  console.log('This app is listening to port ', port);
});