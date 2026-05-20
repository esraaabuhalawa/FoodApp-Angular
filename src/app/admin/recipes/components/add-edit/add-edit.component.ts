import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { FileUtilServiceService } from 'src/app/shared/service/file-util-service.service';
import { environment } from 'src/environments/environment.development';
import { Recipe } from '../../models/recipe';
import { RecipesService } from '../../services/recipes.service';
import { GeneralService } from 'src/app/admin/services/general.service';
import { Category } from 'src/app/admin/services/models/category';
import { Tag } from 'src/app/admin/services/models/tag';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent {
 private readonly recipesService = inject(RecipesService);
  private readonly generalService = inject(GeneralService);

  private readonly toastr = inject(ToastrService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private formSub = new Subscription();
  private readonly fileUtilService = inject(FileUtilServiceService);
  private router = inject(Router)
  errorMessage: string = '';
  serverValidationErrors: any[] = [];
  constructor() { this.initForm() }
  //Variables
  isEditMode = false;
  addRecipeForm!: FormGroup;
  recipe!: Recipe
  tags: Tag[] = [];
  categories: Category[] = [];
  isLoading: boolean = false;
  assetUrl = environment.assestUrl
  recipeID!: string | null;
  imageLink!: string
  //Form Init
  initForm() {
    this.addRecipeForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(4)]],
      description: [null, [Validators.required, Validators.min(10)]],
      price: [null, [Validators.required]],
      tagId: [null, [Validators.required]],
      recipeImage: [null, [Validators.required]],
      categoriesIds: [null, [Validators.required,]]
    })
  }

  //get categories pagination on scroll
  categoryPageNumber: number = 1;
  categoryPageSize: number = 10;
  hasMoreCategories: boolean = true;
  isCategoriesLoading: boolean = false;

  getCategories(): void {
    if (!this.hasMoreCategories || this.isCategoriesLoading) { return;}
    this.isCategoriesLoading = true;
    this.generalService.getAllCategories(
      {
        pageNumber: this.categoryPageNumber,
        pageSize: this.categoryPageSize,
      }
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

  imagePreview: string | null = null;
  onImageSelected(file: File): void {
    this.addRecipeForm.patchValue({ recipeImage: file });
    this.addRecipeForm.get('recipeImage')?.updateValueAndValidity();
  }
  onImageRemoved(): void {
    this.addRecipeForm.patchValue({ recipeImage: null });
  }

  //Submit in both cases Add and Edit
  async onSubmit() {
    if (this.addRecipeForm.invalid) {
      this.addRecipeForm.markAllAsTouched();
      return;
    }

    this.formSub.unsubscribe();
    this.isLoading = true;

    const { recipeImage, ...rest } = this.addRecipeForm.value;
    const formData = new FormData();
    // Append all fields except image
    Object.entries(rest).forEach(([key, val]) =>
      formData.append(key, val as string)
    );

    if (this.isEditMode) {
      if (recipeImage instanceof File) {
        // User uploaded new image
        formData.append('recipeImage', recipeImage);
      } else if (this.imageLink) {
        // Convert existing image url to File
        const file = await this.fileUtilService.imageUrlToFile(this.assetUrl + this.imageLink, 'existing-image.png');
        formData.append('recipeImage', file);
      }
    } else {
      // Add mode
      if (recipeImage) {
        formData.append('recipeImage', recipeImage);
      }
    }

    const request = this.isEditMode
      ? this.recipesService.updateRecipe(Number(this.recipeID), formData)
      : this.recipesService.addRecipe(formData);

    this.formSub = request.subscribe({
      next: (res) => {
        this.errorMessage = '';
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Something went wrong';
        this.toastr.error(err.error?.message || 'Error', 'Error!');
        // const backendErrors = err.error?.additionalInfo?.errors;
        // if (backendErrors) {
        //   Object.values(backendErrors).forEach((messages: any) => {
        //     this.serverValidationErrors.push(...messages);
        //   });
        // }
        this.isLoading = false;
      },
      complete: () => {
        if (!this.isEditMode) {
          this.toastr.success("Recipe is Added Successfully", 'Success!');
        } else {
          this.toastr.success("Recipe is Updated Successfully", 'Success!');
        }
        this.router.navigate(['/dashboard/admin/recipes'])
        this.isLoading = false;
      }
    });
  }
  //image Error
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '../../../../assets/images/placeholder-img.jpg';
  }

  //Get Tags
  getTags(): void {
    this.generalService.getAllTags().subscribe({
      next: (res) => {
        this.tags = res;
      },
      error: (err) => {
        this.toastr.error('Failed to load Tags', 'Error!');
      },
    });
  }

  //get Recipes
  loadRecipeData: boolean = false
  getRecipe(): void {
    this.loadRecipeData = true
    this.addRecipeForm.disable();
    this.recipesService.getRecipeById(Number(this.recipeID)).subscribe({
      next: (res) => {
        this.recipe = res;
        this.loadRecipeData = false
        this.addRecipeForm.enable();
        this.cdr.detectChanges();
        this.addRecipeForm.patchValue({
          name: res.name,
          description: res.description,
          price: res.price,
          tagId: res.tag.id,
          categoriesIds: res.category?.map((item: any) => item.id)
        });
        // Save existing image path
        this.imageLink = res.imagePath;
        if (this.imageLink) {
          this.addRecipeForm.get('recipeImage')?.clearValidators();
        } else {
          this.addRecipeForm.get('recipeImage')?.setValidators([Validators.required]);
        }
        this.addRecipeForm.get('recipeImage')?.updateValueAndValidity();
        // Preview image
        this.imagePreview = this.assetUrl + res.imagePath;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadRecipeData = false
        this.toastr.error('Failed to Load recipes', 'Error!');
        this.addRecipeForm.enable();
      }
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.recipeID = id;
        this.getRecipe();
      }
    });
    this.getTags();
    this.getCategories();
  }
}
