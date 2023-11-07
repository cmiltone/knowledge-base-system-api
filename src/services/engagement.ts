import { injectable } from 'inversify';
import _ from 'lodash';

import { EngagementModel } from '../models/Engagement';
import { PageOptions, Query } from '../types/mongoose';
import { PaginateResult } from 'mongoose';
import { Engagement, Like } from '../types/article';

@injectable()
export class EngagementService {
  async create(data: {
      article: Engagement['article'];
      likes: Engagement['likes'];
      comments: Engagement['comments'];
    }): Promise<Engagement> {
    const { article, likes, comments } = data;
    if (likes?.length) {
      const existingEngagement = await EngagementModel.findOne({ article, 'likes.user': { $in: likes.map((like: Like) => like.user)} });

      if (existingEngagement) throw new Error('Already liked');
    }

    const engagement = await EngagementModel.findOneAndUpdate({ article }, { $push: { likes, comments }}, { new: true, runValidators: true });

    if (!engagement) throw new Error('Engagement Not Found');

    return engagement;
  }

  async update(id: string, data: {
      likes: Engagement['likes'];
      comments: Engagement['comments'];
    }): Promise<Engagement> {
    const existingEngagement = await EngagementModel.findById(id);

    if (!existingEngagement) throw new Error('Engagement not found');

    const engagement = await EngagementModel.findByIdAndUpdate(id, _.pickBy(data), { new: true, runValidators: true });

    return engagement;
  }

  async findById(id: string): Promise<Engagement> {
    const engagement = await EngagementModel.findById(id);

    if (!engagement) throw new Error('Engagement not found');

    return engagement;
  }

  async page(query: Query, options: PageOptions): Promise<PaginateResult<Engagement>> {
    const page = await EngagementModel.paginate<Engagement, PageOptions>(query, options);

    return page;
  }
}
