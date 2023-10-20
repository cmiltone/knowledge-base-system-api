import { injectable } from 'inversify';
import _ from 'lodash';

import { CategoryModel } from '../models/Category';
import { PageOptions, Query } from '../types/mongoose';
import { PaginateResult } from 'mongoose';
import { Category } from '../types/article';

@injectable()
export class CategoryService {
  async create(data: {
      name: Category['name'];
      description: Category['description'];
    }): Promise<Category> {
    const existingCategory = await CategoryModel.findOne({ name: data.name });

    if (existingCategory) throw new Error('Category already created');

    const category = new CategoryModel(data);

    category.save();

    return category;
  }

  async update(id: string, data: {
      name: Category['name'];
      description: Category['description'];
      status: Category['status'];
    }): Promise<Category> {
    const existingCategory = await CategoryModel.findById(id);

    if (!existingCategory) throw new Error('Category not found');

    const category = await CategoryModel.findByIdAndUpdate(id, _.pickBy(data), { new: true, runValidators: true });

    return category;
  }

  async findById(id: string): Promise<Category> {
    const category = await CategoryModel.findById(id);

    if (!category) throw new Error('Category not found');

    return category;
  }

  async page(query: Query, options: PageOptions): Promise<PaginateResult<Category>> {
    const page = await CategoryModel.paginate<Category, PageOptions>(query, options);

    return page;
  }
}
