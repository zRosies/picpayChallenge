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

  // Signing the token in the jwt with 5 min
  const accessToken = jwt.sign(user, `${process.env.ACCESS_TOKEN_SECRET}`, {
    expiresIn: "5m",
  });

  // res.setHeader("Set-Cookie", jwtCookie);
  // maxAge is set in miliseconds; Ex:  10000 = 10s.
  res.cookie("accessToken", accessToken, {
    maxAge: 10000 * 300,
    httpOnly: true,
  });
  res.status(200).json({ jwtToken: accessToken });

  next();
});

export function authentication(req: any, res: any, next?: any) {
  // it is an object containing all the application cookies
  // Getting the authorization jwt token in the object cookies
  const cookies = cookie.parse(req.headers?.cookie || "");
  const { accessToken } = cookies;

  if (!accessToken) {
    return res
      .status(403)
      .json({ message: "You have no token to perform this operation" });
  }

  jwt.verify(
    accessToken,
    `${process.env.ACCESS_TOKEN_SECRET}`,
    (err: any, user: any) => {
      if (err) {
        console.log(err);
        return res.status(401).json({ message: "Token invalid or expired." });
      }
      console.log(user);
      next();
    }
  );
}

export default route;
