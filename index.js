const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const studentsRouter = require('./routes/students');
const teachersRouter = require('./routes/teachers');
const groupsRouter = require('./routes/groups');
const adminsRouter = require('./routes/admins');
const contentRouter = require('./routes/content');

dotenv.config();
const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb', extended: true }));

const url = process.env.MONGO_URL;
const port = process.env.PORT || 5000;

app.use('/api/students', studentsRouter);
app.use('/api/teachers', teachersRouter);
app.use('/api/groups', groupsRouter);
app.use('/api/admins', adminsRouter);
app.use('/api/content', contentRouter);

const connectToDatabase = async () => {
  try {
    await mongoose.connect(url);
    console.log('connected to database successfully');
    app.listen(port, () =>
      console.log(`server is running on http://localhost:${port}`)
    );
  } catch (error) {
    console.log(`error to connect database ${error}`);
  }
};

connectToDatabase();
