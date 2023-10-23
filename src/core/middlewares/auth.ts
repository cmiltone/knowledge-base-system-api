import { Response, Request } from 'express';
import { injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import { NextFunction } from 'connect';
import { Principal } from '../provider/auth';

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  async handler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const principal = this.httpContext.user as Principal;

      if (principal.details && principal.details.status === 'blocked')
        throw new Error('You have been blocked. Contact admin');

      if (principal.details && principal.details.status === 'inactive')
        throw new Error('Your account is inactive. Contact admin');

      if (await principal.isAuthenticated()) return next();

      throw new Error('Authentication failed');
    } catch (error) {
      (error as DefaultError).code = '401';
      (error as DefaultError).status = 401;
      next(error);
    }
  }
}

@injectable()
export class Auth2Middleware extends BaseMiddleware {
  async handler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const principal = this.httpContext.user as Principal;

      if (principal.details && principal.details.status === 'blocked')
        throw new Error('You have been blocked. Contact admin');

      const isAdmin = await principal.isInRole('admin');

      if (!isAdmin)
        throw new Error('You do not have permission to access this resource');

      if (await principal.isAuthenticated()) return next();

      throw new Error('Authentication failed');
    } catch (error) {
      (error as DefaultError).code = '401';
      (error as DefaultError).status = 401;
      next(error);
    }
  }
}