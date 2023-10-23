import { controller, BaseHttpController, httpPut, httpGet, httpDelete } from 'inversify-express-utils';
import { inject } from 'inversify';
import { celebrate, Joi } from 'celebrate';
import { UserService } from '../../services/user';
import { Auth2Middleware, AuthMiddleware } from '../middlewares/auth';
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
        role: Joi.string().equal('user', 'admin', 'expert'),
        status: Joi.string().equal('active', 'inactive', 'blocked'),
      }),
    }),
  )
  async update(): Promise<void> {
    const { userId, fullName, status, role } = this.httpContext.request.body;

    const result = await this.userService.update(userId, { fullName, status, role });

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
        sort: Joi.string().equal('createdAt', 'updatedAt', 'fullName').default('-createdAt'),
        status: Joi.string(),
      })
    })
  )
  async page(): Promise<void> {
    const { userId, limit, page, q, sort, status } = this.httpContext.request.query;

    if (userId) {
      const user = await this.userService.findById(userId as string);

      this.httpContext.response.json(user);
      return;
    }

    const query = {};

    const options: PageOptions = {
      limit: +limit,
      page: +page,
      lean: true,
      sort: sort as string,
    };

    if (q) {
      query['$text'] = { $search: q };
    }

    if (status) {
      query['status'] = status;
    }

    const pageResult = await this.userService.page(query, options);

    this.httpContext.response.json(pageResult);
  }

  @httpDelete(
    '/:userId',
    AuthMiddleware,
    celebrate({
      params: Joi.object({
        userId: Joi.string().required()
      })
    })
  )
  async deleteUser(): Promise<void> {
    const { userId } = this.httpContext.request.params;

    const user = await this.userService.delete(userId);

    this.httpContext.response.json(user);
  }
}
