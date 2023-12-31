import { controller, BaseHttpController, httpPost, httpPut, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { celebrate, Joi } from 'celebrate';
import { CategoryService } from '../../services/category';
import { AuthMiddleware } from '../middlewares/auth';
import { PageOptions } from '../../types/mongoose';

@controller('/v1/category')
export class CategoryController extends BaseHttpController {
  @inject(CategoryService)
  private categoryService: CategoryService;

  @httpPost(
    '/',
    AuthMiddleware,
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
    AuthMiddleware,
    celebrate({
      body: Joi.object({
        categoryId: Joi.string().required(),
        name: Joi.string(),
        description: Joi.string(),
        status: Joi.string().equal('active', 'inactive'),
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
    AuthMiddleware,
    celebrate({
      query: Joi.object({
        categoryId: Joi.string(),
        limit: Joi.number().default(10),
        page: Joi.number().default(1),
        q: Joi.string(),
        sort: Joi.string().equal('createdAt', 'updatedAt', 'name').default('-createdAt'),
        status: Joi.string(),
      })
    })
  )
  async page(): Promise<void> {
    const { categoryId, limit, page, q, sort, status } = this.httpContext.request.query;

    if (categoryId) {
      const category = await this.categoryService.findById(categoryId as string);

      this.httpContext.response.json(category);
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

    const pageResult = await this.categoryService.page(query, options);

    this.httpContext.response.json(pageResult);
  }
}
