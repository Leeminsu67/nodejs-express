import { sequelize } from "../db/database.js";
import SQ from "sequelize";
import { User } from "./auth.js";
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

const Tweet = sequelize.define(`tweet`, {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});
Tweet.belongsTo(User);

// const SELECT_JOIN = `SELECT tw.id, tw.text, tw.createdAt, tw.userId, us.username, us.name, us.url FROM tweets AS tw JOIN users AS us ON tw.userId=us.id`;
// const ORDER_DESC = `ORDER BY tw.createdAt DESC`;

const INCLUDE_USER = {
  attributes: [
    "id",
    `text`,
    `createdAt`,
    `userId`,
    [Sequelize.col(`user.name`), `name`],
    [Sequelize.col(`user.username`), `username`],
    [Sequelize.col(`user.url`), `url`],
  ],
  include: { model: User, attributes: [] },
};

const ORDER_DESC = {
  order: [["createdAt", "DESC"]],
};
// import { useVirtualId } from "../db/database.js";
// import { findById } from "./auth.js";
// import MongoDb from "mongodb";
// import Mongoose from "mongoose";

// const ObjectId = MongoDb.ObjectId;
// const tweetSchema = new Mongoose.Schema(
//   {
//     text: { type: String, required: true },
//     userId: { type: String, required: true },
//     name: { type: String, required: true },
//     username: { type: String, required: true },
//     url: String,
//   },
//   { timestamps: true }
// );
// useVirtualId(tweetSchema);
// const Tweet = Mongoose.model(`Tweet`, tweetSchema);

export async function getAll() {
  // return db
  //   .execute(`${SELECT_JOIN} ${ORDER_DESC}`) //
  //   .then((result) => result[0]);
  return Tweet.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
  });
  // mongoDB
  // return getTweets() //
  //   .find()
  //   .sort({ createdAt: -1 })
  //   .toArray()
  //   .then(mapTweets);
  // mongoose
  // return Tweet.find().sort({ createdAt: -1 });
}

export async function getAllByUsername(username) {
  // mongoose
  // return Tweet.find({ username }).sort({ createdAt: -1 });
  // mongoDB
  // return getTweets() //
  //   .find({ username })
  //   .sort({ createdAt: -1 })
  //   .toArray()
  //   .then(mapTweets);
  // return db
  //   .execute(`${SELECT_JOIN} WHERE us.username=? ${ORDER_DESC}`, [username]) //
  //   .then((result) => result[0]);
  return Tweet.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    include: {
      ...INCLUDE_USER.include,
      where: { username },
    },
  });
}

export async function getById(id) {
  // mongoose
  // return Tweet.findById(id);
  // mongoDB
  // return getTweets()
  //   .findOne({ _id: new ObjectId(id) })
  //   .then(mapOptionnalTweet);
  // return db
  //   .execute(`${SELECT_JOIN} WHERE tw.id=?`, [id]) //
  //   .then((result) => result[0][0]);
  return Tweet.findOne({
    where: { id },
    ...INCLUDE_USER,
  });
}

export async function create(text, userId) {
  // mongoose
  // return findById(userId).then((user) =>
  //   new Tweet({
  //     text,
  //     userId,
  //     name: user.name,
  //     username: user.username,
  //   }).save()
  // );
  // mongoDB
  // const { name, username, url } = await findById(userId);
  // const tweet = {
  //   text,
  //   createdAt: new Date(),
  //   userId,
  //   name: name,
  //   username: username,
  //   url: url,
  // };
  // return getTweets()
  //   .insertOne(tweet)
  //   .then((data) => mapOptionnalTweet({ ...tweet, _id: data.insertedId }));
  return Tweet.create({ text, userId }) //
    .then((data) => this.getById(data.dataValues.id));
  // return db
  //   .execute(`INSERT INTO tweets (text, createdAt, userId) VALUES(?,?,?)`, [
  //     text,
  //     new Date(),
  //     userId,
  //   ])
  //   .then((result) => getById(result[0].insertId));
}

export async function update(id, text) {
  // mongoose
  // return Tweet.findByIdAndUpdate(id, { text }, { new: true });
  // mongoDB
  // return getTweets()
  //   .findOneAndUpdate(
  //     { _id: new ObjectId(id) },
  //     { $set: { text } },
  //     { returnDocument: "after" }
  //   )
  //   .then(mapOptionnalTweet);
  return Tweet.findByPk(id, INCLUDE_USER) //
    .then((tweet) => {
      tweet.text = text;
      return tweet.save();
    });
  // return db
  //   .execute(`UPDATE tweets SET text=? WHERE id=?`, [text, id])
  //   .then(() => getById(id));
}

export async function deleteByid(id) {
  // mongoose
  // return Tweet.findByIdAndDelete(id);
  // mongoDB
  // return getTweets().deleteOne({ _id: new ObjectId(id) });
  return Tweet.findByPk(id) //
    .then((tweet) => {
      tweet.destroy();
    });
  // console.log(id);
  // return db.execute(`DELETE FROM tweets WHERE id=?`, [id]);
}

// function mapOptionnalTweet(tweet) {
//   return tweet ? { ...tweet, id: tweet._id.toString() } : tweet;
// }

// function mapTweets(tweets) {
//   return tweets.map(mapOptionnalTweet);
// }
