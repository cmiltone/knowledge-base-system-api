export interface PageResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  sort?: string;
}

type Query = { $text?: { $search: string } };

export interface PageOptions {
  sort?: string;
  select?: string;
  lean?: boolean;
  limit?: number;
  page?: number;
  key?: string;
  direction?: 'next' | 'previous';
  populate?: Populate[];
}

export interface PagedModel<T extends Document> extends Model<T> {
  page(query: {[key]: string}, options: PageOptions): Promise<PageResult<T>>;
}

export interface DefaultDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
  _status: _Status;
}
