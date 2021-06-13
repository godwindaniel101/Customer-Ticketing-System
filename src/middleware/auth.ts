import { get } from "lodash";
import { Response, NextFunction } from "express";
import { decode } from "../utils/jwt.utils";
import { reIssueAccessToken } from "../module/auth/auth.service";
import { RequestUser } from "../utils/types/Requestuser";
import { CurrentUserType } from "../utils/types/CurrentUser";

const deserializeUser = async (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

  const refreshToken = get(req, "headers.x-refresh");

  if (!accessToken) return next();

  const { decoded, expired } = decode(accessToken);

  if (decoded) {
    req.user = decoded as CurrentUserType;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      // Add the new access token to the response header
      res.setHeader("x-access-token", newAccessToken);

      const { decoded } = decode(newAccessToken);

      req.user = decoded as CurrentUserType;
    }

    return next();
  }

  return next();
};

export default deserializeUser;
