import jwt from "jsonwebtoken";
import * as userRepository from "../data/auth.js";
import { config } from "../config.js";

const AUTH_ERROR = { message: "Authentication Error" };

// 모든 요청에 대해서 검증
export const isAuth = async (req, res, next) => {
  // console.log(req.get("Authorization"));
  // 1. cookie가 헤더에 있는지 없는지 체크
  // 2. Header Non-Browser Client
  let token;

  const authHeader = req.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  //  if no token in the header, check the cookie
  if (!token) {
    token = req.cookies["token"];
  }

  if (!token) {
    return res.status(401).json(AUTH_ERROR);
  }

  // const token = authHeader.split(" ")[1];

  // TODO: Make it secure!
  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    if (error) {
      return res.status(401).json(AUTH_ERROR);
    }
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      return res.status(401).json(AUTH_ERROR);
    }
    req.userId = user.id; // req.customData
    req.token = token;
    next();
  });
};

export const authHandler = async (req) => {
  const authHeader = req.get("Authorization");
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secretKey);
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw { status: 401, ...AUTH_ERROR };
    }
    req.userId = user.id;
    req.token = decoded;
    return true;
  } catch (err) {
    console.log(err);
    throw { status: 401, ...AUTH_ERROR };
  }
};
