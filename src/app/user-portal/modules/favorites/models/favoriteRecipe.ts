// favorite-recipe.interface.ts

export interface FavoriteRecipe {
  id: number;
  creationDate: string;
  modificationDate: string;
  recipe: Recipe;
}

interface Recipe {
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

 interface Category {
  id: number;
  name: string;
  creationDate: string;
  modificationDate: string;
}

interface Tag {
  id: number;
  name: string;
  creationDate: string;
  modificationDate: string;
}
