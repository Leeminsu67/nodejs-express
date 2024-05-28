// import mysql from "mysql2";
import { config } from "../config.js";
import SQ from "sequelize";

const { host, user, database, password } = config.db;
export const sequelize = new SQ.Sequelize(database, user, password, {
  host: host,
  dialect: "mysql",
  logging: false,
});

// const pool = mysql.createPool({
//   host: host,
//   user: user,
//   database: database,
//   password: password,
// });

// export const db = pool.promise();

// MongoDB connect
// import Mongoose from "mongoose";
// import { config } from "../config.js";

// export async function connectDB() {
//   return Mongoose.connect(config.db.host);
// return MongoDb.MongoClient.connect(config.db.host) //
//   .then((client) => {
//     db = client.db();
//   });
// }

// export function useVirtualId(schema) {
//   schema.virtual("id").get(function () {
//     return this._id.toString();
//   });
//   schema.set(`toJSON`, { virtuals: true });
//   schema.set(`toObject`, { virtuals: true });
// }

// 사용자에 대한 컬렉션

// TODO(Ming): Delete blow
// let db;
// export function getUsers() {
//   return db.collection(`users`);
// }

// 트윗에 대한 컬렉션
// export function getTweets() {
//   return db.collection(`tweets`);
// }
