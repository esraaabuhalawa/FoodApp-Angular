import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime } from 'rxjs';

import { environment } from 'src/environments/environment.development';
import { ViewComponent } from './components/view/view.component';
import { GeneralService } from 'src/app/shared/services/general.service';
import { Recipe, RecipeParams } from 'src/app/shared/models/recipe';
import { Tag } from 'src/app/shared/models/tag';
import { Category } from 'src/app/shared/models/category';

@Component({
  selector: 'app-user-recipes',
  templateUrl: './user-recipes.component.html',
  styleUrls: ['./user-recipes.component.css']
})
export class UserRecipesComponent implements OnInit {
  private readonly generalService = inject(GeneralService)
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly toastr = inject(ToastrService);
  private readonly route = inject(ActivatedRoute)
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
  // pagination for recipes
  pageSize: number = 10;
  pageNumber: number = 1;
  total!: number;
  //get categories pagination on scroll
  categoryPageNumber: number = 1;
  categoryPageSize: number = 10;
  hasMoreCategories: boolean = true;
  isCategoriesLoading: boolean = false;

  //Life Cycle Hooks
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.name = params['name'] || '';
      this.pageNumber = 1;
      this.getAllRecipes()
    });
    //debounce time for search by name
    this.searchSubject.pipe(
      debounceTime(500),
    ).subscribe(() => {
      this.pageNumber = 1;
      this.getAllRecipes()
    })

    this.getAllRecipes();
    this.getTags();
    this.getCategories();
  }

  //get tags
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

  //image Error
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '../../../assets/images/placeholder-img.jpg';
  }

  //get Recipes
  getAllRecipes(): void {
    this.isLoading = true;
    const params: RecipeParams = {
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      name: this.name || '',
      tagId: this.selectedTagId || undefined,
      categoryId: this.selectedCategoryId || undefined
    };

    this.generalService.getRecipes(params).subscribe({
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


  onView(recipe: Recipe): void {
    const initialState: ModalOptions = {
      class: 'modal-md modal-dialog-centered',
      initialState: {
        recipe: recipe
      }
    };
    this.bsModalRef = this.modalService.show(ViewComponent, initialState);
  }

  //Helper Functions
  //Search by name
  searchSubject: Subject<string> = new Subject();
  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  //filteration Method
  onFilterChange(): void {
    this.pageNumber = 1; // reset pagination
    this.getAllRecipes();
  }

  //Pagination Method
  onPageChange(page: number): void {
    this.pageNumber = page;
    this.getAllRecipes();
  }
}
