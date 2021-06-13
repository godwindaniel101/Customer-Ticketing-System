import { get } from 'lodash';
import { Request, Response, NextFunction } from 'express';

const hasRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = get(req, 'user');

        if (!roles.includes(user.role)) {
            return res.status(403).json({ message: 'Permission Denied' });
        }
        next();
    };
};

export default hasRole;
