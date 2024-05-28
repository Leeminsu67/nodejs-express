import express from "express";
import "express-async-errors";
import * as tweetController from "../controller/tweet.js";
import { body } from "express-validator";
import { validate } from "../middleware/validator.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

const validateTweet = [
  body("text")
    .trim()
    .isLength({ min: 3 })
    .withMessage("text should be at least 3 characters"),
  validate,
];

// 전체조회 및 username
router.get("/", isAuth, tweetController.getTweet);

// id값으로 개별 조회
router.get("/:id/", isAuth, tweetController.getTweetById);

// id값으로 수정
router.put("/:id/", isAuth, validateTweet, tweetController.update);

// id값으로 삭제
router.delete("/:id/", isAuth, tweetController.deleteById);

// 값 생성하여 tweetArr에 값을 전부 저장함
router.post("/", isAuth, validateTweet, tweetController.create);

export default router;
