import { Request } from 'express';
import { injectable, inject } from 'inversify';
import { interfaces } from 'inversify-express-utils';
import { UserService } from '../../services/user';
import { TokenService } from '../../services/token';

export class Principal implements interfaces.Principal {
  public details: User;

  constructor(details: User) {
    this.details = details;
  }

  async isAuthenticated(): Promise<boolean> {
    return !!this.details && this.details.status === 'active';
  }

  async isResourceOwner(resource: { type: 'user'; id: string }): Promise<boolean> {
    if (this.details && resource.type === 'user') return resource.id === this.details._id;

    return false;
  }

  async isInRole(role: User['role']): Promise<boolean> {
    return !!this.details && this.details.role === role;
  }

  async hasPermission(roles: User['role'][]): Promise<boolean> {
    return !!this.details && roles.some((role) => role === this.details.role);
  }
}

@injectable()
export class AuthProvider implements interfaces.AuthProvider {
  @inject(UserService)
  private userService: UserService;

  @inject(TokenService)
  private tokenService: TokenService;

  async getUser(req: Request): Promise<interfaces.Principal> {
    let user: User;

    try {
      if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];

        if (token) {
          const decodedUser: { _id: string; verified: boolean } = await this.tokenService.decode(token);

          user = await this.userService.findById(decodedUser._id);

          user = { ...decodedUser, ...user };
        }
      }
    } catch (error) {
      console.error('auth %o', (error as Error).message);
    }

    if (user)
      console.debug(
        'auth id: %o name: %o email: %o',
        user._id,
        user.fullName,
        user.email,
      );

    return new Principal(user);
  }
}
