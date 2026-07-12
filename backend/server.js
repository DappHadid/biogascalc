const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { syncDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/domes', require('./routes/domeRoutes'));
app.use('/api/example', require('./routes/exampleRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendPath));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

syncDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\nServer running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`   http://0.0.0.0:${PORT}\n`);
  });
});
