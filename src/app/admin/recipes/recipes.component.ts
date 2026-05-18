import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RecipesService } from './services/recipes.service';
import { Recipe, RecipeParams } from './models/recipe';
import { environment } from 'src/environments/environment.development';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from 'src/app/shared/ui/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Subject } from 'rxjs';
import { ViewComponent } from 'src/app/admin/recipes/components/view/view.component';
import { GeneralService } from '../services/general.service';
import { Category } from '../services/models/category';
import { Tag } from '../services/models/tag';
import { ActivatedRoute } from '@angular/router';

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
    this.generalService.getAllCategories(
      {
        pageNumber: this.categoryPageNumber,
        pageSize: this.categoryPageSize,
        name: this.name
      }
      //this.categoryPageSize, this.categoryPageNumber
      //
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

  onView(recipe: Recipe): void {
    const initialState: ModalOptions = {
      class: 'modal-md modal-dialog-centered',
      initialState: {
        recipe: recipe
      }
    };
    this.bsModalRef = this.modalService.show(ViewComponent, initialState);
  }

  //Delete modal
  openDeleteModal(recipe: Recipe): void {
    this.bsModalRef = this.modalService.show(
      //Sendin intial values to Confirm Bootstrap Modal
      ConfirmDialogComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        initialState: {
          title: recipe.name,
          message: `Are you sure you want to delete <strong class="text-danger"> ${recipe.name} </strong> ? if you are sure just click on delete it`,
          deleteURl: `Recipe/${recipe.id}`
        }
      }
    );

    //Reload Data After success Delete
    this.bsModalRef?.onHidden?.subscribe((res: any) => {
      if (res.deleted) {
        this.loadRecipes();
      }
    })
  }

  ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    this.name = params['name'] || '';
     this.pageNumber = 1;
     this.loadRecipes()
  });
    // //debounce time for search by name
    this.searchSubject.pipe(
      debounceTime(500),
    ).subscribe(() => {
      this.pageNumber = 1;
      this.loadRecipes()
    })

    this.loadRecipes();
    this.getTags();
    this.getCategories();
  }
}
