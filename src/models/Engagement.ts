import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { DefaultDocument } from '../types/mongoose';
import { Engagement } from '../types/article';

const likeSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {type: Date, default: Date.now},
}, { timestamps: true });

const commentSchema = new Schema({
  message: { type: String, required: true },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {type: Date, default: Date.now},
}, { timestamps: true });

commentSchema.add({
  replies: [commentSchema],
})

const engagementSchema = new Schema({
  article: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [likeSchema],
  comments: [commentSchema],
},
{ timestamps: true });

type EngagementDocument = DefaultDocument & Engagement;

engagementSchema.plugin(mongoosePaginate);

export const EngagementModel = model<EngagementDocument, PaginateModel<EngagementDocument>>('Engagement', engagementSchema);
