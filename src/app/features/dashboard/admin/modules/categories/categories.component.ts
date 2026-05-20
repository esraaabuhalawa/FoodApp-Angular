import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/components/ui/confirm-dialog/confirm-dialog.component';
import { environment } from 'src/environments/environment.development';
import { AddEditComponent } from './components/add-edit/add-edit.component';
import { CategoryService } from './services/category.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { Category } from 'src/app/shared/models/category';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  providers: [
    { provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true, adaptivePosition: true } }
  ]
})
export class CategoriesComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly toastr = inject(ToastrService);
  private readonly generalService = inject(GeneralService);
  //bootstrap model
  private readonly modalService = inject(BsModalService);
  bsModalRef?: BsModalRef;
  //Variables
  categories: Category[] = [];
  isLoading: boolean = false;
  assetUrl = environment.assestUrl
  // filters
  name: string = '';
  // pagination for categories
  pageSize: number = 5;
  pageNumber: number = 1;
  total!: number;

  //Life Cycle Hooks
  ngOnInit(): void {
    //debounce time for search by name
    this.searchSubject.pipe(
      debounceTime(500),
    ).subscribe(() => {
      this.pageNumber = 1;
      this.getAllCategories()
    })
    this.getAllCategories();
  }
  //API Functions
  //get Categories
  getAllCategories(): void {
    this.isLoading = true;
    const params: any = {
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      name: this.name || '',
    };
    this.generalService.getAllCategories(params).subscribe({
      next: (res) => {
        this.categories = res.data;
        this.isLoading = false;
        this.total = res.totalNumberOfRecords
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastr.error('Failed to Load categories', 'Error!');
        this.isLoading = false;
      }
    });
  }
  //Add ,Edit and view modal
  openCategoryModal(isEditMode: boolean, isViewMode: boolean, category?: Category): void {
    const initialState: ModalOptions = {
      class: 'modal-lg modal-dialog-centered',
      initialState: {
        category: category,
        isEditMode: isEditMode,
        isViewMode: isViewMode
      }
    };
    this.bsModalRef = this.modalService.show(AddEditComponent, initialState);

    this.bsModalRef?.onHidden?.subscribe((res: any) => {
      if (res.categoryUpdated) {
        this.getAllCategories();
      }
    })
  }

  //Delete modal
  openDeleteModal(category: Category): void {
    this.bsModalRef = this.modalService.show(
      //Sending intial values to Confirm Bootstrap Modal
      ConfirmDialogComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        initialState: {
          title: category.name,
          message: `Are you sure you want to delete <strong class="text-danger"> ${category.name} </strong> ? if you are sure just click on delete it`,
          deleteURl: `Category/${category.id}`
        }
      }
    );

    //Reload Data After success Delete
    this.bsModalRef?.onHidden?.subscribe((res: any) => {
      if (res.deleted) {
        this.getAllCategories();
      }
    })
  }

  //Helper Functions
  //Search by name
  searchSubject: Subject<string> = new Subject();
  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }
  //Pagination Method
  onPageChange(page: number): void {
    this.pageNumber = page;
    this.getAllCategories();
  }
  //image Error
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '../../../assets/images/placeholder-img.jpg';
  }
}
