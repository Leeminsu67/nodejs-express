import SQ from "sequelize";
import { sequelize } from "../db/database.js";
const DataTypes = SQ.DataTypes;

export const User = sequelize.define(
  `user`,
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    url: DataTypes.TEXT,
  },
  { timestamps: false }
);

// import MongoDb from "mongodb";
// import Mongoose from "mongoose";
// import { useVirtualId } from "../db/database.js";

// const ObjectId = MongoDb.ObjectId;

// const userSchema = new Mongoose.Schema({
//   username: { type: String, required: true },
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   password: { type: String, required: true },
//   url: String,
// });

// _id -> id
// useVirtualId(userSchema);
// const User = Mongoose.model("User", userSchema);

export async function findByUsername(username) {
  // return User.findOne({ username });
  // return getUsers().findOne({ username }).next().then(mapOptionalUser);
  return User.findOne({ where: { username } });
  // return db
  //   .execute(`SELECT * FROM users WHERE username=?`, [username]) //
  //   .then((result) => result[0][0]);
}

export async function createUser(user) {
  // return new User(user).save().then((data) => data.id);
  // return getUsers()
  //   .insertOne(user)
  //   .then((data) => data.insertedId.toString());
  return User.create(user).then((data) => {
    return data.dataValues.id;
  });
  // const { username, password, name, email, url } = user;
  // return db
  //   .execute(
  //     "INSERT INTO users (username, password, name, email, url) VALUES (?, ?, ?, ?, ?)",
  //     [username, password, name, email, url]
  //   )
  //   .then((result) => result[0].insertId);
}

export async function findById(id) {
  // return User.findById(id);
  // return getUsers()
  //   .findOne({ _id: new ObjectId(id) })
  //   .then(mapOptionalUser);

  return User.findByPk(id);
  // return db
  //   .execute(`SELECT * FROM users WHERE id=?`, [id]) //
  //   .then((result) => result[0][0]);
}

// 중복된 곳 함수
// function mapOptionalUser(user) {
//   return user ? { ...user, id: user._id.toString() } : user;
// }
