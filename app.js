// 1. 패키지 모듈 설치
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import "express-async-errors";
import yaml from "yamljs";
import swaggerUI from "swagger-ui-express";
import * as OpenAPIValidator from "express-openapi-validator";

import tweetsRouter from "./router/tweets.js";
import authRouter from "./router/auth.js";
import { config } from "./config.js";
import { initSocket } from "./connection/socket.js";
// import { connectDB } from "./db/database.js";
import { sequelize } from "./db/database.js";
import { csrfCheck } from "./middleware/csrf.js";
import rateLimit from "./middleware/rate-limiter.js";
import * as apis from "./controller/index.js";
import { authHandler } from "./middleware/auth.js";

const app = express();

// cors
const corsOptions = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
  credentials: true, // allow the Access-Control Allow Credentials
  // withCredentials: true,
};
const openAPIDocument = yaml.load("./api/openapi.yaml");
// 미들웨어 세팅
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan("tiny"));
app.use(csrfCheck);
app.use(rateLimit);

const options = {
  dotfiles: "ignore", // 숨겨져 있는 파일은 무시
  etag: false,
  index: false,
  maxAge: "1d", // 캐시의 시간 설정
  redirect: false,
  setHeeaders: function (res, path, stat) {
    res.set("x-timestamp", Date.now());
  }, // 헤더에 필요한 데이터가 있으면 헤더에 추가해서 보내주는 줌
};

app.use(express.static("public", options)); // public안에 있는 리소스에 접근이 가능함

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(openAPIDocument));

// 전체 조회, 트윗 생성
app.use("/tweets", tweetsRouter);
app.use("/auth", authRouter);

app.use(
  OpenAPIValidator.middleware({
    apiSpec: "./api/openapi.yaml",
    validateResponses: true,
    operationHandlers: {
      resolver: modulePathResolver,
    },
    validateSecurity: {
      handlers: {
        jwt_auth: authHandler,
      },
    },
  })
);

function modulePathResolver(_, route, apiDoc) {
  const pathKey = route.openAPIRoute.substring(route.basePath.length);
  const operation = apiDoc.paths[pathKey][route.method.toLowerCase()];
  const methodName = operation.operationId;
  return apis[methodName];
}

// 유저별 조회
// app.use("/users", userRouter);
// 아이디 개별 조회, 수정, 삭제

// 콜백 함수를 자주 사용해야 하는데 꿀팁
//snipp json javascript
// app.use((error, req, res, next) => {
//   console.error(error);
//   res.status(500).send({ message: "Something went wrong" });
// });

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((error, req, res, next) => {
  console.log(error);
  res.sendStatus(error.status || 500).json({
    message: error.message,
  });
});

// mysql
// db.getConnection().then((connection) => console.log(connection));
sequelize.sync().then(() => {
  console.log(`server is started... ${new Date()}`);
  const server = app.listen(config.port);
  initSocket(server);
});

// mongoDB
// connectDB()
//   .then(() => {
//     const server = app.listen(config.port);
//     initSocket(server);
//   })
//   .catch(console.error);

// const socketIO = new Server(server, {
//   cors: {
//     origin: `*`,
//   },
// });

// socketIO.on(`connection`, (socket) => {
//   console.log(`Client is here!`);
//   // socketIO.emit(`dwitter`, `Hello !!`);
//   // socketIO.emit(`dwitter`, `Hello !!`);
// });

// setInterval(() => {
//   socketIO.emit(`dwitter`, `Hello!`);
// }, 1000);
