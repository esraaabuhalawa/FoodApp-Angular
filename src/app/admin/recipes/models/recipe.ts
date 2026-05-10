import { Category } from "./category";
import { Tag } from "./tag";

export interface RecipeParams {
  name?: string;
  tagId?: number;
  categoryId?: number;
  pageSize: number;
  pageNumber: number;
}

export interface Recipe {
  id: number;
  name: string;
  imagePath: string;
  description: string;
  price: number;
  creationDate: string;
  modificationDate: string;
  category: Category[];
  tag: Tag;
}
