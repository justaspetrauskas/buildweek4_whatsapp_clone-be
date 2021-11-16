import jwt from "jsonwebtoken";
import UserModel from "../schemas/userSchema.js";

export const JWTAuthenticate = async (user) => {
  const accessToken = await generateJWT({ _id: user._id });
  const refreshToken = await generateRefreshJWT({ _id: user._id });

  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
};

export const generateJWT = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30 min" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    )
  );

export const verifyJWT = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) reject(err);
      resolve(decodedToken);
    });
  });

export const generateRefreshJWT = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    )
  );

export const verifyRefreshJWT = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decodedToken) => {
      if (err) reject(err);
      resolve(decodedToken);
    });
  });

export const verifyRefreshAndGenerateTokens = async (actualRefreshToken) => {
  // 1. Check the validity (exp date and integrity)
  const decodedRefreshToken = await verifyRefreshJWT(actualRefreshToken);

  // 2. If the token is valid we are going to check if it is in db
  const user = await UserModel.findById(decodedRefreshToken._id);

  if (!user) throw createHttpError(404, "User not found");

  // 3. If we find the token we need to compare it to the actualRefreshToken
  if (user.refreshToken && user.refreshToken === actualRefreshToken) {
    // 4. If everything is fine we are going to generate a new pair of tokens (and we are storing new refreshtoken in db)

    const { accessToken, refreshToken } = await JWTAuthenticate(user);

    // 5. Return the tokens
    return { accessToken, refreshToken };
  } else throw createHttpError(401, "Refresh token not valid!");
};
