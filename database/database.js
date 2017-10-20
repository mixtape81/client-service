import mongoose from 'mongoose';
import Users from './users.js';

const mongoDB = 'mongodb://localhost/mixtape';
mongoose.connect(mongoDB, {
  useMongoClient: true
});

const db = mongoose.connection;
db.on('error', err => console.error(err));
db.once('open', () => console.log('MongoDB connected!'));

export default db;
