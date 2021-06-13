import { AnySchema } from 'yup';
import { Request, Response, NextFunction } from 'express';
import asyncError from '../utils/error/asyncError';

const validate = (schema: AnySchema) => asyncError(async (req: Request, res: Response, next: NextFunction) => {
        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params
        });
        return next();
      });

export default validate;
