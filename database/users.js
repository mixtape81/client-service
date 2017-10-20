import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UsersSchema = Schema({
  id: {
    type: Number,
    unique: true
  },
  joinDate: Date,
  birthDate: Date,
  location: String,
  paidStatus: Boolean,
  genreGroup: Number,
  favoriteArtists: [Number]
});

UsersSchema
  .virtual('url')
  .get(() => `/users/${this._id}`);

const Users = mongoose.model('Users', UsersSchema);

// Users.create({
//   joinDate: new Date(),
//   birthdate: new Date(92, 9, 14),
//   location: 'San Francisco',
//   paidStatus: true,
//   genreGroup: 3,
//   favoriteArtists: [1, 2, 3, 4, 5]
// }, err => console.error(err));

export default Users;
