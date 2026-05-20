import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent {
 constructor(public bsModalRef: BsModalRef, private fb: FormBuilder) { }
  private readonly categoryService = inject(CategoryService)
  private readonly toaster = inject(ToastrService)
   loadingData:boolean = false;
  addCategoryForm!: FormGroup;
  isEditMode!: boolean;
  isViewMode!: boolean;
  category!: any
  private formSub = new Subscription();

  cancel(): void {
    this.bsModalRef.hide();
  }
  initForm(): void {
    this.addCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  patchForm(): void {
    this.loadingData = true
    this.categoryService.getCategoryById(this.category.id).subscribe({
      next: (res) => {
        this.loadingData = false
        this.addCategoryForm.patchValue({
          name: res.name
        });
      },
      error: (err) => {
        this.loadingData = false
        this.toaster.error('Error In Fetching Data',"!Error")
      }
    });
  }
  errorMessage: string = '';
  isLoading: boolean = false;
  submit(): void {
    if (this.addCategoryForm.invalid) {
      this.addCategoryForm.markAllAsTouched();
      return;
    }
    this.formSub.unsubscribe();
    this.isLoading = true;
    const request = this.isEditMode ?
      this.categoryService.updateCategory(Number(this.category.id), {name:this.addCategoryForm.value.name}) :
      this.categoryService.addCategory(this.addCategoryForm.value.name)

    this.formSub = request.subscribe({
      next: (res) => {
        this.errorMessage = '';
        this.isLoading = false;
        this.bsModalRef.hide();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Something went wrong';
        this.toaster.error(err.error?.message || 'Error', 'Error!');
        this.isLoading = false;
      },
      complete: () => {
        if (!this.isEditMode) {
          this.toaster.success("Category is Added Successfully", 'Success!');
        } else {
          this.toaster.success("Category is Updated Successfully", 'Success!');
        }
        this.bsModalRef.onHidden?.emit({ categoryUpdated: true });
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    this.initForm();

    if (this.category) {
      this.patchForm();
    }
  }
}
