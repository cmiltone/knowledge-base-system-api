import { controller, BaseHttpController, httpPut, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { celebrate, Joi } from 'celebrate';
import { UserService } from '../../services/user';
import { Auth2Middleware } from '../middlewares/auth';
import { PageOptions } from '../../types/mongoose';

@controller('/v1/user')
export class UserController extends BaseHttpController {
  @inject(UserService)
  private userService: UserService;

  @httpPut(
    '/',
    Auth2Middleware,
    celebrate({
      body: Joi.object({
        userId: Joi.string().required(),
        fullName: Joi.string(),
        status: Joi.string().equal('active', 'inactive', 'blocked'),
      }),
    }),
  )
  async update(): Promise<void> {
    const { userId, fullName, status } = this.httpContext.request.body;

    const result = await this.userService.update(userId, { fullName, status });

    this.httpContext.response.json(result);
  }

  @httpGet(
    '/',
    Auth2Middleware,
    celebrate({
      query: Joi.object({
        userId: Joi.string(),
        limit: Joi.number().default(10),
        page: Joi.number().default(1),
        q: Joi.string(),
        sort: Joi.string().equal('createdAt', 'updatedAt', 'fullName').default('createdAt')
      })
    })
  )
  async page(): Promise<void> {
    const { userId, limit, page, q, sort } = this.httpContext.request.query;

    if (userId) {
      const user = await this.userService.findById(userId as string);

      this.httpContext.response.json(user);
      return;
    }

    let query = {};

    const options: PageOptions = {
      limit: +limit,
      page: +page,
      lean: true,
      sort: sort as string,
    };

    if (q) {
      query = { $text: { $search: q } }
    }

    const pageResult = await this.userService.page(query, options);

    this.httpContext.response.json(pageResult);
  }
}