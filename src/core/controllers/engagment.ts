import { controller, BaseHttpController, httpPost, httpPut, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { celebrate, Joi } from 'celebrate';
import { EngagementService } from '../../services/engagement';
import { AuthMiddleware } from '../middlewares/auth';
import { PageOptions } from '../../types/mongoose';

@controller('/v1/engagement')
export class EngagementController extends BaseHttpController {
  @inject(EngagementService)
  private engagementService: EngagementService;

  @httpPost(
    '/',
    AuthMiddleware,
    celebrate({
      body: Joi.object({
        articleId: Joi.string().required(),
        likes: Joi.array().items(Joi.object({
          user: Joi.string().required(),
        })),
        comments: Joi.array().items(Joi.object({
          user: Joi.string().required(),
          message: Joi.string().required()
        })),
      }),
    }),
  )
  async create(): Promise<void> {
    const { articleId, likes, comments } = this.httpContext.request.body;

    const result = await this.engagementService.create({ article: articleId, likes, comments });

    this.httpContext.response.json(result);
  }

  @httpPut(
    '/',
    AuthMiddleware,
    celebrate({
      body: Joi.object({
        engagementId: Joi.string().required(),
        likes: Joi.array().items(Joi.object({
          user: Joi.string().required(),
        })).required(),
        comments: Joi.array().items(Joi.object({
          user: Joi.string().required(),
          message: Joi.string().required()
        })).required(),
      }),
    }),
  )
  async update(): Promise<void> {
    const { engagementId, likes, comments } = this.httpContext.request.body;

    const result = await this.engagementService.update(engagementId, { likes, comments });

    this.httpContext.response.json(result);
  }

  @httpGet(
    '/',
    AuthMiddleware,
    celebrate({
      query: Joi.object({
        engagementId: Joi.string(),
        limit: Joi.number().default(10),
        page: Joi.number().default(1),
        sort: Joi.string().equal('createdAt', 'updatedAt').default('-createdAt'),
        status: Joi.string(),
      })
    })
  )
  async page(): Promise<void> {
    const { engagementId, limit, page, sort } = this.httpContext.request.query;

    if (engagementId) {
      const engagement = await this.engagementService.findById(engagementId as string);

      this.httpContext.response.json(engagement);
      return;
    }

    const query = {};

    const options: PageOptions = {
      limit: +limit,
      page: +page,
      lean: true,
      sort: sort as string,
    };

    const pageResult = await this.engagementService.page(query, options);

    this.httpContext.response.json(pageResult);
  }
}
