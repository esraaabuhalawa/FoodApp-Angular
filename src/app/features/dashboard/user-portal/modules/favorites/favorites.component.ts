import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.development';
import { ViewComponent } from '../user-recipes/components/view/view.component';
import { FavoritService } from './services/favorit.service';
import { FavoriteRecipe } from './models/favoriteRecipe';
import { Category } from 'src/app/shared/models/category';
import { RecipeParams, Recipe } from 'src/app/shared/models/recipe';
import { Tag } from 'src/app/shared/models/tag';
import { GeneralService } from 'src/app/shared/services/general.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent {
  private readonly generalService = inject(GeneralService)
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly toastr = inject(ToastrService);
  private readonly favoriteService = inject(FavoritService)
  //bootstrap model
  private readonly modalService = inject(BsModalService);
  bsModalRef?: BsModalRef;

  //Variables
  recipes: FavoriteRecipe[] = []
  filteredRecipes: FavoriteRecipe[] = []
  tags: Tag[] = [];
  categories: Category[] = [];
  isLoading: boolean = false;
  assetUrl = environment.assestUrl

  // filters
  name: string = '';
  selectedTagId?: number;
  selectedCategoryId?: number;

  // pagination for recipes
  pageSize: number = 5;
  pageNumber: number = 1;
  total!: number;

  //get categories pagination on scroll
  categoryPageNumber: number = 1;
  categoryPageSize: number = 10;
  hasMoreCategories: boolean = true;
  isCategoriesLoading: boolean = false;

  //Life Cycle Hooks
  ngOnInit(): void {
    this.getAllRecipes();
    this.getTags();
    this.getCategories();
  }

  //API Functions
  getTags(): void {
    this.generalService.getAllTags().subscribe({
      next: (res) => {
        this.tags = res;
      },
      error: (err) => {
        console.log(err)
        this.toastr.error('Failed to load Tags', 'Error!');
      },
    });
  }
  
  getCategories(): void {
    if (!this.hasMoreCategories || this.isCategoriesLoading) {
      return;
    }

    this.isCategoriesLoading = true;
    this.generalService.getAllCategories(
      {
        pageNumber: this.categoryPageNumber,
        pageSize: this.categoryPageSize,
        name: this.name
      }
    ).subscribe({
      next: (res) => {
        this.categories = [...this.categories, ...res.data];
        // if API returned less than pageSize so no more data
        if (res.data.length < this.categoryPageSize) {
          this.hasMoreCategories = false;
        }
        this.isCategoriesLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to Load Categories', 'Error!');
        this.isCategoriesLoading = false;
      }
    });
  }

  //categories pagination function
  loadMoreCategories(): void {
    if (this.isCategoriesLoading || !this.hasMoreCategories) { return; }
    this.categoryPageNumber++;
    this.getCategories();
  }

  //get Recipes
  getAllRecipes(): void {
    this.isLoading = true;
    const params: RecipeParams = {
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
    };

    this.favoriteService.getUserFavoriteRecipes(params).subscribe({
      next: (res) => {
        this.recipes = res.data;
        this.filteredRecipes = [...this.recipes];
        this.isLoading = false;
        this.total = res.totalNumberOfRecords
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastr.error('Failed to Load recipes', 'Error!');
        this.isLoading = false;
      }
    });
  }

  onView(recipe: Recipe): void {
    const initialState: ModalOptions = {
      class: 'modal-lg modal-dialog-centered',
      initialState: {
        recipe: recipe
      }
    };
    this.bsModalRef = this.modalService.show(ViewComponent, initialState);
  }


  addToFavorite(id: number): void {
    this.favoriteService.addRecipeToFavorite(id).subscribe({
      next: (res) => {
        this.toastr.success('Recipe added to favorites', '!success');
      },
      error: (err) => {
        this.toastr.error('Something went wrong');
      }
    });
  }

  deleteFromFavorite(id: number) {
    this.favoriteService.deleteRecipefromFavorite(id).subscribe({
      next: (res) => {
        console.log('delete', res)
        this.getAllRecipes()
        this.toastr.success('You UnFavorit this Recipe Successfully', '!success');
      },
      error: (err) => {
        this.toastr.error('Something went wrong');
      }
    });
  }

  //Helper Functions
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '../../../assets/images/placeholder-img.jpg';
  }

  applyFilters(): void {
    this.filteredRecipes = this.recipes.filter((recipe) => {
      // search by name
      const matchesName = !this.name || recipe.recipe.name?.toLowerCase().includes(this.name.toLowerCase());
      // filter by tag
      const matchesTag = !this.selectedTagId || recipe.recipe.tag?.id === this.selectedTagId;
      // filter by category
      const matchesCategory = !this.selectedCategoryId || recipe.recipe.category.some(item => item.id === this.selectedCategoryId);
      return matchesName && matchesTag && matchesCategory;
    });
  }

  //Search by name
  onSearchChange() {
    this.applyFilters();
  }
  //filteration Method
  onFilterChange(): void {
    this.pageNumber = 1; // reset pagination
    this.applyFilters();
  }

  //Pagination Method
  onPageChange(page: number): void {
    this.pageNumber = page;
    this.getAllRecipes();
  }
}
