import { NextFunction, Request, Response } from 'express';
import { omit } from 'lodash';
import asyncError from '../../utils/error/asyncError';
import { registerHandler, validatePassword, validateEmail, resetPasswordHandler, logoutHandler } from './auth.service';
import { createSession, createAccessToken, findSessions, findUser } from './auth.service';
import { sign, decode } from '../../utils/jwt.utils';
import { AppError } from '../../utils/error';
import { get } from 'lodash';
import config from 'config';

// Register User method
export const register = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const checkUser = await findUser({ email: req.body.email });

    if (checkUser) return next(new AppError(`${req.body.email} is already registerd`, 422));
    //check for email uniqueness
    const user = await registerHandler(req.body);
    //send user detail
    return res.status(201).json({ data: omit(user.toJSON(), 'password') });
});

// Login User method
export const login = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const user = await validatePassword(req.body);

    if (!user) return next(new AppError(`Invalid username or password`, 401));

    // Create a session
    const session = await createSession(user._id, req.get('user-agent') || '');

    // create access token
    const accessToken = createAccessToken({ user, session });

    // create refresh token
    const refreshToken = sign(session, { expiresIn: config.get('refreshTokenTtl') });

    // send refresh & access token back
    return res.status(200).json({ accessToken, refreshToken });
});


// Forget Password method
export const forgetPassword = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const user = await validateEmail(req.body);

    if (!user) return next(new AppError(`Invalid Email`, 401));
    //send user detail
    const session = await createSession(user._id, req.get('user-agent') || '');

    //generate reset token
    const resetToken = sign(session, { expiresIn: config.get('resetTokenTtl') });

    // send refresh & access token back
    return res.status(200).json({ resetToken });
});

// Reset Password method
export const resetPassword = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const user = await resetPasswordHandler(req.params.resetToken, req.body);

    if (!user) return next(new AppError(`Token Invalid or Expired`, 401));
    // return success message after a sucesxfful reset
    return res.status(200).json({
        message: 'Password succesfully reset'
    });
});

// Get current logged in user method
export const loggedIn = asyncError(async (req: Request, res: Response) => {
    const user = get(req, 'user');
    //send user detail
    return res.status(200).json({ data: user });
});

// Logout user method
export const logout = asyncError(async (req: Request, res: Response) => {
    const sessionId = get(req, 'user.session');

    const user = await logoutHandler({ _id: sessionId }, { valid: false });
    //send user detail
    return res.status(200).json({ message: 'logout successful' });
});

// Get Session method
export const getUserSessionsHandler = asyncError(async (req: Request, res: Response) => {
    const userId = get(req, 'user._id');

    const sessions = await findSessions({ user: userId, valid: true });

    return res.send(sessions);
});
