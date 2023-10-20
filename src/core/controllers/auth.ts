import { controller, BaseHttpController, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { celebrate, Joi } from 'celebrate';
import { AuthService } from '../../services/auth';

@controller('/v1/auth')
export class AuthController extends BaseHttpController {
  @inject(AuthService)
  private authService: AuthService;

  @httpPost(
    '/login',
    celebrate({
      body: Joi.object({
        identifier: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
  )
  async login(): Promise<void> {
    const { identifier, password } = this.httpContext.request.body;

    const result = await this.authService.login({ identifier }, { password, verify: true });

    this.httpContext.response.json({ ...result });
  }

  @httpPost(
    '/register',
    celebrate({
      body: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
  )
  async register(): Promise<void> {
    const { firstName, lastName, phoneNumber, email, password } = this.httpContext.request.body;

    const result = await this.authService.register(
      { firstName, lastName, phoneNumber, email },
      { password, verify: true },
    );

    this.httpContext.response.json({ ...result });
  }
}
