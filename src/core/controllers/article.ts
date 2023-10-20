import { controller, BaseHttpController, httpPost, httpPut } from 'inversify-express-utils';
import { inject } from 'inversify';
import { celebrate, Joi } from 'celebrate';
import { ArticleService } from '../../services/article';
import { Auth2Middleware } from '../middlewares/auth';

@controller('/v1/article')
export class ArticleController extends BaseHttpController {
  @inject(ArticleService)
  private articleService: ArticleService;

  @httpPost(
    '/',
    Auth2Middleware,
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
    Auth2Middleware,
    celebrate({
      body: Joi.object({
        articleId: Joi.string().required(),
        title: Joi.string().required(),
        content: Joi.string().required(),
        creator: Joi.string().required(),
        category: Joi.string().required(),
        status: Joi.string().equal('published', 'draft', 'deleted').required(),
      }),
    }),
  )
  async register(): Promise<void> {
    const { articleId, title, content, creator, category, status } = this.httpContext.request.body;

    const result = await this.articleService.update(articleId, { title, content, creator, category, status });

    this.httpContext.response.json(result);
  }
}
