import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RecipesService } from './services/recipes.service';
import { Tag } from './models/tag';
import { Category } from './models/category';
import { Recipe, RecipeParams } from './models/recipe';
import { environment } from 'src/environments/environment.development';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from 'src/app/shared/ui/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  providers: [
    { provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true, adaptivePosition: true } }
  ]
})
export class RecipesComponent implements OnInit {
  private readonly recipesService = inject(RecipesService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly toastr = inject(ToastrService);

  //bootstrap model
  private readonly modalService = inject(BsModalService);
  bsModalRef?: BsModalRef;

  //Variables
  recipes: Recipe[] = []
  tags: Tag[] = [];
  categories: Category[] = [];
  isLoading: boolean = false;
  assetUrl = environment.assestUrl

  // filters
  name: string = '';
  selectedTagId?: number;
  selectedCategoryId?: number;

  // pagination
  pageSize: number = 10;
  pageNumber: number = 1;
  total!: number;

  //get tags
  getTags(): void {
    this.recipesService.getAllTags().subscribe({
      next: (res) => {
        this.tags = res;
      },
      error: (err) => {
        console.log(err)
        this.toastr.error('Failed to load Tags', 'Error!');
      },
    });
  }

  //get categories pagination on scroll
  categoryPageNumber: number = 1;
  categoryPageSize: number = 10;
  hasMoreCategories: boolean = true;
  isCategoriesLoading: boolean = false;

  getCategories(): void {
    if (!this.hasMoreCategories || this.isCategoriesLoading) {
      return;
    }

    this.isCategoriesLoading = true;
    this.recipesService.getAllCategories(
      this.categoryPageSize,
      this.categoryPageNumber
    ).subscribe({
      next: (res) => {
        this.categories = [...this.categories, ...res.data];

        // if API returned less than pageSize → no more data
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
  loadMoreCategories(): void {
    if (this.isCategoriesLoading || !this.hasMoreCategories) { return; }
    this.categoryPageNumber++;
    this.getCategories();
  }
  // getCategories(): void {
  //   this.isCategoriesLoading = true
  //   this.recipesService.getAllCategories().subscribe({
  //     next: (res) => {
  //       this.categories = res.data;
  //     },
  //     error: (err) => {
  //       this.toastr.error('Failed to Load Categories', 'Error!');
  //     }
  //   });
  // }

  //image Error
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '../../../assets/images/placeholder-img.jpg';
  }

  //get Recipes
  loadRecipes(): void {
    this.isLoading = true;
    const params: RecipeParams = {
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      name: this.name || '',
      tagId: this.selectedTagId || undefined,
      categoryId: this.selectedCategoryId || undefined
    };

    this.recipesService.getRecipes(params).subscribe({
      next: (res) => {
        this.recipes = res.data;
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
  //Search by name
  searchSubject: Subject<string> = new Subject();
  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  //filteration Method
  onFilterChange(): void {
    this.pageNumber = 1; // reset pagination
    this.loadRecipes();
  }

  //Pagination Method
  onPageChange(page: number): void {
    this.pageNumber = page;
    this.loadRecipes();
  }

  onView(recipe: any): void {
    console.log('View', recipe);
    // navigate or open modal
  }

  //Delete modal
  openDeleteModal(recipeId: number): void {
    this.bsModalRef = this.modalService.show(
      ConfirmDialogComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        initialState: {
          title: 'Delete Recipe',
          message: 'are you sure you want to delete this item ? if you are sure just click on delete it',
          confirmCallback: () => {
            this.deleteRecipe(recipeId);
          }
        }
      }
    );
  }

  //Delete Recipe Function
  deleteRecipe(id: number): void {
    this.recipesService.deleteRecipe(id).subscribe({
      next: (res) => {
        this.toastr.success('Recipe deleted successfully', 'Success!');
        this.loadRecipes()
      },
      error: (err) => {
        this.toastr.error('Failed to delete', 'Error!');
      }
    });
  }


  ngOnInit(): void {
    //debounce time for search by name
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.pageNumber = 1;
      this.loadRecipes();

    });
    this.loadRecipes();
    this.getTags();
    this.getCategories();
  }
}
