import { injectable } from 'inversify';
import _ from 'lodash';
import { PaginateResult } from 'mongoose';

import { ArticleModel } from '../models/Article';
import { PageOptions, Query } from '../types/mongoose';
import { MediaModel } from '../models/Media';
import { Media } from '../types/media';
import { Article } from '../types/article';
import { File } from '../types/file';

type ArticleData = {
  title: Article['title'];
  content: Article['content'];
  category: Article['category'];
  creator: Article['creator'];
  status: Article['status'];
  media: Media[];
};

type ArticleUpdateData = {
  title: Article['title'];
  content: Article['content'];
  category: Article['category'];
  creator: Article['creator'];
  status: Article['status'];
  media: File[];
  deletedMedia: string[]
};

@injectable()
export class ArticleService {
  async create(data: ArticleData): Promise<Article> {
    const { title, content, category, creator, status, media } = data;
    const existingArticle = await ArticleModel.findOne({ title });

    if (existingArticle) throw new Error('Article already created');

    const article = new ArticleModel(_.pickBy({ title, content, creator, category, status }));

    for (let i = 0; i < media.length; i++) {
      const item = data.media[i];
      
      const file = new MediaModel(_.pickBy({ ...item, ...{ article: article._id, title: article.title }}));

      await file.save();
    }

    await article.save();

    await article.populate([
      { path: 'category' },
      { path: 'creator' },
      { path: 'media' },
      { path: 'engagement' },
    ])

    return article;
  }

  async update(id: string, data: ArticleUpdateData): Promise<Article> {
    const { title, content, category, creator, status, media, deletedMedia } = data;
    const existingArticle = await ArticleModel.findById(id);

    if (!existingArticle) throw new Error('Article not found');

    const article = await ArticleModel.findByIdAndUpdate(id, _.pickBy({ title, content, creator, category, status }), { new: true, runValidators: true });

    if (media.length) {
      for (let i = 0; i < media.length; i++) {
        const item = media[i];
        
        const file = new MediaModel( _.pickBy({ ...item, ...{ article: article._id, title: article.title }}));

        await file.save();
      }
    }

    if (deletedMedia.length) await MediaModel.deleteMany({ _id: { $in: deletedMedia }});

    await article.populate([
      { path: 'category' },
      { path: 'creator' },
      { path: 'media' },
      { path: 'engagement' },
    ])

    return article;
  }

  async findById(id: string): Promise<Article> {
    const article = await ArticleModel.findById(id);

    if (!article) throw new Error('Article not found');

    await article.populate([
      { path: 'creator' },
      { path: 'category' },
      { path: 'media' },
      { path: 'engagement' },
    ]);
  
    return article;
  }

  async page(query: Query, options: PageOptions): Promise<PaginateResult<Article>> {
    const page = await ArticleModel.paginate<Article, PageOptions>(query, options);

    return page;
  }

  async delete(articleId: string): Promise<Article> {
    const article = await ArticleModel.findById(articleId);

    if (!article) throw new Error('Article not found');

    await ArticleModel.findByIdAndDelete(articleId);

    await MediaModel.deleteMany({ article: articleId });

    return article;
  }
}
