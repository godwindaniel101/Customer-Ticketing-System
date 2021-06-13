import { Request } from "express";
import { CurrentUserType } from "./CurrentUser";

export interface RequestUser extends Request {
    user?: CurrentUserType;
}