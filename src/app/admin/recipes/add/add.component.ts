import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.development';
import { Category } from '../models/category';
import { Recipe } from '../models/recipe';
import { Tag } from '../models/tag';
import { RecipesService } from '../services/recipes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { NgxFileDropEntry } from 'ngx-file-drop';
import { Subscription } from 'rxjs';
import { FileUtilServiceService } from 'src/app/shared/service/file-util-service.service';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {
  private readonly recipesService = inject(RecipesService);
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

  // maxFileSize = 5 * 1024 * 1024; // 5 MB
  // //Image drop code
  // imagePreview: string | null = null;
  // onFileDrop(files: NgxFileDropEntry[]) {
  //   const droppedFile = files[0];
  //   if (droppedFile.fileEntry.isFile) {
  //     const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
  //     fileEntry.file((file: File) => {
  //       // File size validation
  //       if (file.size > this.maxFileSize) {
  //         this.toastr.error(
  //           'Image size must not exceed 10 MB',
  //           'Error'
  //         );

  //         this.addRecipeForm.get('recipeImage')?.reset();
  //         return;
  //       }

  //       // Set file to form
  //       this.addRecipeForm.patchValue({
  //         recipeImage: file
  //       });

  //       this.addRecipeForm.get('recipeImage')?.updateValueAndValidity();
  //       // Preview
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         this.imagePreview = reader.result as string;
  //       };
  //       reader.readAsDataURL(file);
  //     });
  //   }
  // }

  // removeImage(): void {
  //   this.imagePreview = null;
  //   this.addRecipeForm.patchValue({ recipeImage: null });
  // }

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
        const backendErrors = err.error?.additionalInfo?.errors;
        if (backendErrors) {
          Object.values(backendErrors).forEach((messages: any) => {
            this.serverValidationErrors.push(...messages);
          });
        }
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
    this.recipesService.getAllTags().subscribe({
      next: (res) => {
        this.tags = res;
      },
      error: (err) => {
        this.toastr.error('Failed to load Tags', 'Error!');
      },
    });
  }

  //get categories
  // getCategories(): void {
  //   this.recipesService.getAllCategories().subscribe({
  //     next: (res) => {
  //       this.categories = res.data;
  //     },
  //     error: (err) => {
  //       this.toastr.error('Failed to Load Categories', 'Error!');
  //     }
  //   });
  // }

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
          categoriesIds: res.category?.map((c: any) => c.id)
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
