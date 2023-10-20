import { controller, BaseHttpController, httpPost, httpPut, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { celebrate, Joi } from 'celebrate';
import { ArticleService } from '../../services/article';
import { AuthMiddleware } from '../middlewares/auth';
import { PageOptions } from '../../types/mongoose';

@controller('/v1/article')
export class ArticleController extends BaseHttpController {
  @inject(ArticleService)
  private articleService: ArticleService;

  @httpPost(
    '/',
    AuthMiddleware,
    celebrate({
      body: Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
        creator: Joi.string().required(),
        category: Joi.string().required(),
        status: Joi.string().equal('published', 'draft', 'deleted').required(),
      }),
    }),
  )
  async create(): Promise<void> {
    const { title, content, creator, category, status } = this.httpContext.request.body;

    const result = await this.articleService.create({ title, content, creator, category, status });

    this.httpContext.response.json(result);
  }

  @httpPut(
    '/',
    AuthMiddleware,
    celebrate({
      body: Joi.object({
        articleId: Joi.string().required(),
        title: Joi.string(),
        content: Joi.string(),
        creator: Joi.string(),
        category: Joi.string(),
        status: Joi.string().equal('published', 'draft', 'deleted'),
      }),
    }),
  )
  async register(): Promise<void> {
    const { articleId, title, content, creator, category, status } = this.httpContext.request.body;

    const result = await this.articleService.update(articleId, { title, content, creator, category, status });

    this.httpContext.response.json(result);
  }

  @httpGet(
    '/',
    AuthMiddleware,
    celebrate({
      query: Joi.object({
        articleId: Joi.string(),
        limit: Joi.number().default(10),
        page: Joi.number().default(1),
        q: Joi.string(),
        sort: Joi.string().equal('createdAt', 'updatedAt', 'title').default('createdAt')
      })
    })
  )
  async page(): Promise<void> {
    const { articleId, limit, page, q, sort } = this.httpContext.request.query;

    if (articleId) {
      const article = await this.articleService.findById(articleId as string);

      this.httpContext.response.json(article);
      return;
    }

    let query = {};

    const options: PageOptions = {
      limit: +limit,
      page: +page,
      lean: true,
      sort: sort as string,
      populate: [{ path: 'creator' }, { path: 'category' }]
    };

    if (q) {
      query = { $text: { $search: q } }
    }

    const pageResult = await this.articleService.page(query, options);

    this.httpContext.response.json(pageResult);
  }
}
