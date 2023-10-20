import { controller, BaseHttpController, httpPost, httpPut } from 'inversify-express-utils';
import { inject } from 'inversify';
import { celebrate, Joi } from 'celebrate';
import { CategoryService } from '../../services/category';
import { Auth2Middleware } from '../middlewares/auth';

@controller('/v1/category')
export class CategoryController extends BaseHttpController {
  @inject(CategoryService)
  private categoryService: CategoryService;

  @httpPost(
    '/',
    Auth2Middleware,
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
      }),
    }),
  )
  async create(): Promise<void> {
    const { name, description } = this.httpContext.request.body;

    const result = await this.categoryService.create({ name, description });

    this.httpContext.response.json(result);
  }

  @httpPut(
    '/',
    Auth2Middleware,
    celebrate({
      body: Joi.object({
        categoryId: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        status: Joi.string().equal('active', 'inacrive').required(),
      }),
    }),
  )
  async register(): Promise<void> {
    const { categoryId, name, description, status } = this.httpContext.request.body;

    const result = await this.categoryService.update(categoryId, { name, description, status });

    this.httpContext.response.json(result);
  }
}
