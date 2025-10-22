require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookie = require('cookie-parser');
const morgan = require('morgan');

const app = express();
app.use(express.json());
app.use(cookie());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: false }));
app.use(morgan('dev'));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));

const { connect } = require('./config/db'); connect();
app.listen(process.env.PORT || 3001);
