import { injectable } from 'inversify';
import _ from 'lodash';

import { CategoryModel } from '../models/Category';
// import { PageOptions, PageResult } from '../types/mongoose';

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

    const category = await CategoryModel.findByIdAndUpdate(id, _.pickBy(data), { new: true });

    return category;
  }

  async findById(id: string): Promise<Category> {
    const category = await CategoryModel.findById(id);

    if (!category) throw new Error('Category not found');

    return category;
  }

  // async page(options: PageOptions): Promise<PageResult<Category>> {
  //   const page = await CategoryModel.paginate<PageResult<Category>>(options);

  //   return page;
  // }
}
