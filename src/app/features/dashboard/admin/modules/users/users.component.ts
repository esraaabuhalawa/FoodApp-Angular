import { roleEnum } from '../../../../../core/enums/role.enum';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { UsersService } from './services/users.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/components/ui/confirm-dialog/confirm-dialog.component';
import { environment } from 'src/environments/environment.development';
import { Group, User } from './services/model/user';
import { UserParams } from './services/model/user-params';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { ViewComponent } from './components/view/view.component';
import { CurrentUser } from 'src/app/features/auth/models/currentUser';
import { AuthService } from 'src/app/features/auth/services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [
    { provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true, adaptivePosition: true } }
  ]
})
export class UsersComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly toastr = inject(ToastrService);
  //bootstrap model
  private readonly modalService = inject(BsModalService);
  bsModalRef?: BsModalRef;
  //Variables
  users: User[] = []
  isLoading: boolean = false;
  assetUrl = environment.assestUrl
  currentUser!: CurrentUser;
  // filters
  searhType: string = '1'
  name: string = '';
  email: string = '';
  country: string = '';
  group: number | null = null;
  role!: roleEnum
  // pagination for users
  pageSize: number = 10;
  pageNumber: number = 1;
  total!: number;

  groups = [
    {
      id: 1,
      userRole: "Admin"
    },
    {
      id: 2,
      userRole: "User"
    }
  ];

  //Life Cycle Hooks
  ngOnInit(): void {
    //debounce time for search by name
    this.searchSubject.pipe(debounceTime(500),).subscribe(() => {
      this.pageNumber = 1;
      this.getAllUsers()
    })

    this.getUserData();
    this.getAllUsers();
  }

  //API Functions
  getAllUsers(): void {
    this.isLoading = true;
    const params: UserParams = {
      userName: this.name,
      email: this.email,
      country: this.country,
      groups: this.group ? [this.group] : [],
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
    };

    this.usersService.getAllUsers(params).subscribe({
      next: (res) => {
        this.users = res.data;
        this.isLoading = false;
        this.total = res.totalNumberOfRecords
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastr.error('Failed to Load users', 'Error!');
        this.isLoading = false;
      }
    });
  }
  
  onView(user: User): void {
    const initialState: ModalOptions = {
      class: 'modal-lg modal-dialog-centered',
      initialState: {
        user: user,
        currentUser: this.currentUser
      }
    };
    this.bsModalRef = this.modalService.show(ViewComponent, initialState);
  }

  //Delete modal
  openDeleteModal(user: User): void {
    this.bsModalRef = this.modalService.show(
      //Sendin intial values to Confirm Bootstrap Modal
      ConfirmDialogComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        initialState: {
          title: user.userName,
          message: `Are you sure you want to delete <strong class="text-danger"> ${user.userName} </strong> ? if you are sure just click on delete it`,
          deleteURl: `Users/${user.id}`
        }
      }
    );

    //Reload Data After success Delete
    this.bsModalRef?.onHidden?.subscribe((res: any) => {
      if (res.deleted) {
        this.getAllUsers();
      }
    })
  }

  //get Currect User Data
  getUserData() {
    this.authService.getCurrentUserData().subscribe({
      next: (res: CurrentUser) => {
        this.currentUser = res
      },
      error: (err) => {
        console.log(err)
      },
    })
  }
  //Search by name
  searchSubject: Subject<string> = new Subject();
  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }
  //Helper Functions
  //Set User Role
  userRole(userGrop: Group) {
    return userGrop?.name === roleEnum.SuperAdmin ? 'Admin' : 'User'
  }

  isUser(userGrop: Group) {
    return userGrop?.name === roleEnum.SystemUser ? true : false
  }
  //image Error
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '../../../assets/images/placeholder-img.jpg';
  }

  //filteration Method
  onFilterChange(): void {
    this.pageNumber = 1; // reset pagination
    this.getAllUsers();
  }

  //Pagination Method
  onPageChange(page: number): void {
    this.pageNumber = page;
    this.getAllUsers();
  }
}
