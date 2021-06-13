import { get } from 'lodash';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error';

const requiresAuth = async (req: Request, res: Response, next: NextFunction) => {
    const user = get(req, 'user');
    
    if (!user) {
        return next(new AppError('Unauthorized' , 403));
    }

    return next();
};

export default requiresAuth;
