import { injectable } from 'inversify';
import _ from 'lodash';
import { PaginateResult } from 'mongoose';

import { ArticleModel } from '../models/Article';
import { PageOptions, Query } from '../types/mongoose';

@injectable()
export class ArticleService {
  async create(data: {
      title: Article['title'];
      content: Article['content'];
      category: Article['category'];
      creator: Article['creator'];
      status: Article['status'];
    }): Promise<Article> {
    const existingArticle = await ArticleModel.findOne({ title: data.title });

    if (existingArticle) throw new Error('Article already created');

    const article = new ArticleModel(data);

    await article.populate([
      { path: 'category' },
      { path: 'creator' }
    ])

    article.save();

    return article;
  }

  async update(id: string, data: { title, content, category, creator, status }): Promise<Article> {
    const existingArticle = await ArticleModel.findById(id);

    if (!existingArticle) throw new Error('Article not found');

    const article = await ArticleModel.findByIdAndUpdate(id, _.pickBy(data), { new: true });

    await article.populate([
      { path: 'category' },
      { path: 'creator' }
    ])

    return article;
  }

  async findById(id: string): Promise<Article> {
    const article = await ArticleModel.findById(id);

    if (!article) throw new Error('Article not found');

    await article.populate([{ path: 'creator' }, { path: 'category' }])

    return article;
  }

  async page(query: Query, options: PageOptions): Promise<PaginateResult<Article>> {
    const page = await ArticleModel.paginate<Article, PageOptions>(query, options);

    return page;
  }
}
