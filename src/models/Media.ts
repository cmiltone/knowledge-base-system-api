import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { DefaultDocument } from '../types/mongoose';
import { Media } from '../types/media';

const mediaSchema = new Schema({
  title: { type: String, required: false },
  article: { type: Schema.ObjectId, ref: 'Article' },
  ext: { type: String },
  mime: { type: String },
  type: { type: String, enum: ['image', 'video'] },
  thumbnail: { type: String },
  filename: { type: String },
  size: { type: Number },
  dimensions: {
    type: new Schema(
      {
        height: { type: Number, required: true },
        width: { type: Number, required: true },
        orientation: { type: Number, required: true },
      },
      { _id: false },
    ),
  },
},
{ timestamps: true });

type MediaDocument = DefaultDocument & Media;

mediaSchema.plugin(mongoosePaginate);

mediaSchema.index({ title: 'text' });

export const MediaModel = model<MediaDocument, PaginateModel<MediaDocument>>('Media', mediaSchema);
