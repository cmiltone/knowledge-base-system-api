import { controller, BaseHttpController, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { celebrate, Joi } from 'celebrate';
import { ArticleService } from '../../services/article';
import { AuthMiddleware } from '../middlewares/auth';
import { CategoryService } from '../../services/category';

@controller('/v1/dashboard-summary')
export class DashboardController extends BaseHttpController {
  @inject(ArticleService)
  private articleService: ArticleService;

  @inject(CategoryService)
  private categoryService: CategoryService;

  @httpGet(
    '/',
    AuthMiddleware,
    celebrate({
      query: Joi.object({
        userId: Joi.string(),
      })
    })
  )
  async summarize(): Promise<void> {
    const { userId } = this.httpContext.request.query;
    const articleQuery = {};
    const categoryQuery = {};
    
    articleQuery['status'] = 'published';
    categoryQuery['status'] = 'active';

    if (userId) {
      articleQuery['creator'] = userId as string;

      const articlePage = await this.articleService.page(articleQuery, {});

      const categoryPage = await this.categoryService.page(categoryQuery, {})

      this.httpContext.response.json({
        totalArticles: articlePage.totalDocs,
        totalCategories: categoryPage.totalDocs
      });
      return;
    }


    const articlePage = await this.articleService.page(articleQuery, {});
    const categoryPage = await this.categoryService.page(categoryQuery, {})

    this.httpContext.response.json({
      totalArticles: articlePage.totalDocs,
      totalCategories: categoryPage.totalDocs
    });
  }
}
