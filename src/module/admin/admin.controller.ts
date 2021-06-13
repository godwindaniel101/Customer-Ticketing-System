import { Request, Response, NextFunction } from 'express';
import { omit } from 'lodash';
import { get } from 'lodash';
import { createUser, findAndUpdate, findUser, findUsers } from './admin.service';
import asyncError from '../../utils/error/asyncError';
import { AppError } from '../../utils/error';

// Create new user
export const create = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const checkUser = await findUser({ email: req.body.email });

    if (checkUser) return next(new AppError(`${req.body.email} is already registered`, 422));
    const user = await createUser(req.body);
    const data = omit(user.toJSON(), 'password');
    return res.status(201).json({
        data
    });
});

// Get User Details
export const getUser = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const _id = get(req, 'params.userId');

    const data = await findUser({ _id });
    return res.status(200).json({
        data
    });
});

// Get all user
export const getAllUser = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const data = await findUsers({});
    return res.status(200).json({
        data
    });
});

// Update user record
export const update = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const _id = get(req, 'params.userId');
    const data = await findAndUpdate({ _id }, req.body, { new: true });
    return res.status(200).json({
        data
    });
});

// Delete user record
export const userDelete = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: 'ok'
    });
});
