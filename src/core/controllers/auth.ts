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

    const result = await this.authService.login({ identifier, password });

    this.httpContext.response.json(result);
  }

  @httpPost(
    '/register',
    celebrate({
      body: Joi.object({
        fullName: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
  )
  async register(): Promise<void> {
    const { fullName, phoneNumber, email, password } = this.httpContext.request.body;

    const result = await this.authService.register({ fullName, email, phoneNumber, password });

    this.httpContext.response.json(result);
  }
}
