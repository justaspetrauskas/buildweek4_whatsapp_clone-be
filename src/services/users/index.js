import express from "express";
import createHttpError from "http-errors";
import UserModel from "../../schemas/userSchema.js";
import {
  JWTAuthenticate,
  verifyJWT,
  verifyRefreshAndGenerateTokens,
} from "../../Authorization/tools.js";
import { JWTAuthMiddleware } from "../../Authorization/token.js";
import { imageUpload } from "../../Tools/multerTools.js";
// import { basicAuthMiddleware } from "../../Authorization/basic.js";

const userRouter = express.Router();

// REGISTRATION
userRouter.post("/account", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    await newUser.save();
    res.status(200).send(newUser);
  } catch (error) {
    next(error);
  }
});

// LOGIN
userRouter.post("/session", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.checkCredentials(email, password);
    if (user) {
      const { accessToken, refreshToken } = await JWTAuthenticate(user);

      res.send({ accessToken, refreshToken });
    } else {
      next(createHttpError(401, "Credentials are not correct!"));
    }
  } catch (error) {
    next(error);
  }
});
// LOGOUT
userRouter.delete("/session", JWTAuthMiddleware, async (req, res, next) => {
  try {
    console.log(req.user.refreshToken);
    req.user.refreshToken = undefined;
    await req.user.save();
    res.send("loged out");
  } catch (error) {
    next(error);
  }
});

// REFRESH
userRouter.post(
  "/session/refresh",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const currentRefreshToken = req.user.refreshToken;
      const { accessToken, refreshToken } =
        await verifyRefreshAndGenerateTokens(currentRefreshToken);
      res.send({ accessToken, refreshToken });
      //   req.user.refreshToken = undefined;
      //   await req.user.save();
      //   res.send("loged out");
    } catch (error) {
      next(error);
    }
  }
);

// Me
userRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

// EDIT ME
userRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    // const { email, username } = req.body;
    const updatedProfile = await UserModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    );
    res.send(updatedProfile);
  } catch (error) {
    next(error);
  }
});

// UPLOAD PICTURE
userRouter.post(
  "/account/:userId/avatar",
  imageUpload.single("avatar"),
  async (req, res, next) => {
    try {
      const imagePath = req.file.path;
      const userAvatar = await UserModel.findByIdAndUpdate(
        req.params.userId,
        { avatar: imagePath },
        { new: true }
      );
      res.status(201).send(userAvatar);
    } catch (err) {
      next(err);
    }
  }
);

// CHANGE PICTURE
userRouter.post(
  "/me/avatar",
  JWTAuthMiddleware,
  imageUpload.single("avatar"),
  async (req, res, next) => {
    try {
      const imagePath = req.file.path;
      const userAvatar = await UserModel.findByIdAndUpdate(
        req.user._id,
        { avatar: imagePath },
        { new: true }
      );
      res.status(201).send(userAvatar);
    } catch (err) {
      next(err);
    }
  }
);

// USER
userRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (user) res.send(user);
    else
      next(createHttpError(404, `user with id ${req.params.id} is not found`));
  } catch (error) {
    next(error);
  }
});

userRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    // const filters = req.query;
    const { username, email } = req.query;
    if (username || email) {
      const filteredUsers = await UserModel.find({
        $or: [{ username }, { email }],
      });
      if (filteredUsers.length > 0) {
        res.send(filteredUsers);
      } else {
        res.send("User does not exist");
      }
    } else {
      const allUsers = await UserModel.find({ _id: { $ne: req.user._id } });
      res.send(allUsers);
    }
  } catch (error) {
    next(error);
  }
});

export default userRouter;
