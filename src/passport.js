/** @format */

import passport from "passport";
import GithubStrategy from "passport-github";
import FacebookStrategy from "passport-kakao";
import User from "./models/User";
import {
  githubLoginCallBack,
  kakaoLoginCallBack,
} from "./controllers/userController";
import routes from "./routes";

// use this strategy
// 원하는 만큼 사용가능
// 지금은 local-mongoose
passport.use(User.createStrategy());

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GH_CLIENT_ID,
      clientSecret: process.env.GH_CLIENT_SECRET,
      callbackURL: `http://localhost:4000${routes.githubCallBack}`,
    },
    githubLoginCallBack
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.KT_CLIENT_ID,
      clientSecret: process.env.KT_CLIENT_SECRET,
      callbackURL: `http://localhost:4000${routes.kakaoCallBack}`,
    },
    kakaoLoginCallBack
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
