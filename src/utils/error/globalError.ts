
import { NextFunction, Request, Response } from "express";
import AppError from './AppError';
class GlobalError {
    err: AppError;
    res: Response;
    constructor(err: AppError, res: Response) {
        this.err = err;
        this.res = res;
    }
    handleCastErrorDB = () => {
        return this.res.status(500).json({
            message: this.err.message
        })
    };
    handleUniqueErrorDB = () => {
        return this.res.status(500).json({
            message: this.err.message
        })
    };
    handleValidationErrorDB = () => {
        return this.res.status(422).json({
            error: this.err.message
        })
    };
    handleJsonWebTokenErrorAuth = () => {
        return this.res.status(500).json({
            message: this.err.message
        })
    };
    handleTokenExpiredErrorAuth = () => {
        return this.res.status(500).json({
            message: this.err.message
        })
    };
    handleUncaughtError = () => {
        return this.res.status(500).json({
            error: this.err.message
        })
    };
    handleUnauthorizedErrorDB = () => {
        const errStatus:number = this.err.statusCode || 401
        return this.res.status(errStatus).json({
            error: this.err.message
        })
    };
}

export default function (err: AppError, req: Request, res: Response, next: NextFunction) {
    const handleError = new GlobalError(err, res)
    /**
     * 
     * Sort Errors first By name
     */
    //log all errors
    if (err.name == 'CastError') return handleError.handleCastErrorDB();
    /**
     * handle Unique DB Errors
     */
    if (err.name == '11000') return handleError.handleUniqueErrorDB();
    /**
     * Handle validation errors
     */
    if (err.name == 'ValidationError') return handleError.handleValidationErrorDB();
    /**
     * handle JasonWebToken Error
     */
    if (err.name == 'JsonWebTokenError') return handleError.handleJsonWebTokenErrorAuth();
    /**
     * Handle expired token
     */
    if (err.name == 'TokenExpiredError') return handleError.handleTokenExpiredErrorAuth();
    /**
     * Handle any other error
     */
    /****
     * 
     * Sort Error By Code
     * 
     * 
     */
     if (err.statusCode == 401 ||err.statusCode == 403 ) return handleError.handleUnauthorizedErrorDB();
    /**
     * handle JasonWebToken Error
     */
     if (err.statusCode == 422) return handleError.handleValidationErrorDB();
    /**
     * handle JasonWebToken Error
     */
    return handleError.handleUncaughtError();

}
