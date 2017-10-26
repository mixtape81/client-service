import createLocations from './locations';
import createUsers from './users';

createLocations().then(() => createUsers()).catch(err => console.error(err));
