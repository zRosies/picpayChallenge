import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookie from "cookie";
dotenv.config();

const route = express.Router();

interface UserJWT {
  name: string;
}

route.post("/", (req, res, next) => {
  const user: UserJWT = req.body;

  const accessToken = jwt.sign(user, `${process.env.ACCESS_TOKEN_SECRET}`, {
    expiresIn: "60s",
  });

  // Setting a cookie with the token to be checked in the routes
  const jwtCookie = cookie.serialize("authorization", accessToken, {
    httpOnly: true,
  });

  // res.setHeader("Set-Cookie", jwtCookie);
  // maxAge is set in miliseconds; Ex:  10000 = 10s.
  res.cookie("authorization", jwtCookie, { maxAge: 10000, httpOnly: true });
  res.status(200).json({ jwtToken: accessToken });

  next();
});

export function authenticateToken(req: any, res: any, next?: any) {
  // const authHeader = req.headers["authorization"];

  // it is an object containing all the application cookies
  const cookies = cookie.parse(req.headers?.cookie || "");
  const token = cookie.authorization;
  console.log(req.params.user_id);
  console.log(cookies);
  next();
}

export default route;
