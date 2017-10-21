import app from './app';
import db from '../database/database';

const port = 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));
