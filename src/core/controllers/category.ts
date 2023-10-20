import { controller, BaseHttpController, httpPost, httpPut, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { celebrate, Joi } from 'celebrate';
import { CategoryService } from '../../services/category';
import { Auth2Middleware } from '../middlewares/auth';
import { PageOptions } from '../../types/mongoose';

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
  async update(): Promise<void> {
    const { categoryId, name, description, status } = this.httpContext.request.body;

    const result = await this.categoryService.update(categoryId, { name, description, status });

    this.httpContext.response.json(result);
  }

  @httpGet(
    '/',
    Auth2Middleware,
    celebrate({
      query: Joi.object({
        categoryId: Joi.string(),
        limit: Joi.number().default(10),
        page: Joi.number().default(1),
        q: Joi.string(),
        sort: Joi.string().equal('createdAt', 'updatedAt', 'name').default('createdAt')
      })
    })
  )
  async page(): Promise<void> {
    const { categoryId, limit, page, q, sort } = this.httpContext.request.query;

    if (categoryId) {
      const category = await this.categoryService.findById(categoryId as string);

      this.httpContext.response.json(category);
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

    const pageResult = await this.categoryService.page(query, options);

    this.httpContext.response.json(pageResult);
  }
}
