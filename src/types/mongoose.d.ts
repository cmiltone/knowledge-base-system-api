export interface PageResult<T> {
  docs: T[];
  total: number;
  limit: number;
  page: number;
  pages: number;
  sort: string;
}

export interface PageOptions {
  q?: string;
  sort?: string;
  select?: string;
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
