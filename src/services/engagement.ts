import { injectable } from 'inversify';
import _ from 'lodash';

import { EngagementModel } from '../models/Engagement';
import { PageOptions, Query } from '../types/mongoose';
import { PaginateResult } from 'mongoose';
import { Comment, Engagement, Like } from '../types/article';

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

    const engagement = await EngagementModel.findOneAndUpdate({ article }, {
      $push: {
        likes: likes?.map((like: Like) => ({ ...like, ...{ updatedAt: Date.now() } })) ?? [],
        comments: comments?.map((comment: Comment) => ({ ...comment, ...{ updatedAt: Date.now() } })) ?? [],
      } },
      { new: true, runValidators: true }
    );

    if (!engagement) throw new Error('Engagement Not Found');

    return engagement;
  }

  async update(id: string, data: {
      comment: { id: Comment['_id']; message: Comment['message']; };
    }): Promise<Engagement> {
    const existingEngagement = await EngagementModel.findById(id);

    if (!existingEngagement) throw new Error('Engagement not found');

    const { comment } = data;
    
    const idx = existingEngagement.comments.findIndex((item: Comment) => item._id === comment.id);

    if (idx > -1) {
      (existingEngagement.comments[idx] as Comment).message = comment.message;
      (existingEngagement.comments[idx] as Comment).updatedAt = new Date();

      existingEngagement.save();
    }

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



  async deleteLikesOrComment(id: string, data: {
      likes: Like['_id'][];
      comments: Comment['_id'][];
      replies?: { _id: string; commentId: string }[];
    }): Promise<Engagement> {
    const existingEngagement = await EngagementModel.findById(id);

    if (!existingEngagement) throw new Error('Engagement not found');

    const { likes, comments } = data;

    const _likes = existingEngagement.likes?.filter((item: Like) => !likes.includes(item._id)) ?? [];
    const _comments = existingEngagement.comments?.filter((item: Comment) => !comments.includes(item._id)) ?? [];

    const engagement = await EngagementModel.findByIdAndUpdate(id, { likes: _likes, comments: _comments }, { new: true, runValidators: true });

    return engagement;
  }

}
