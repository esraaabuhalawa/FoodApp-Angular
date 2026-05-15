import { Component, inject, OnInit } from '@angular/core';
//import { Router } from '@angular/router';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ChangePasswordComponent } from 'src/app/auth/components/change-password/change-password.component';
import { CurrentUser } from 'src/app/auth/models/currentUser';
import { AuthService } from 'src/app/auth/services/auth.service';
import { roleEnum } from 'src/app/core/enums/role.enum';
import { NavbarUiService } from 'src/app/core/services/navbar-ui.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [
    // per-component config (optional)
    {
      provide: BsDropdownConfig,
      useValue: { isAnimated: true, autoClose: true, adaptivePosition: true },
    },
  ],
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  readonly navbarUiService = inject(NavbarUiService);
  //private readonly router = inject(Router)

  assetUrl = environment.assestUrl;
  isMobile$ = this.navbarUiService.isMobile$;
  currentUser!: CurrentUser;

  get isSuperAdmin(): boolean {
    return this.authService.getRole() === roleEnum.SuperAdmin;
  }

  //image Error
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '../../../../../assets/images/user-placeholder.png';
  }

  getUserData() {
    this.authService.getCurrentUserData().subscribe({
      next: (res: CurrentUser) => {
        this.currentUser = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  toggleSidebar() {
    this.navbarUiService.toggleSidebar();
  }

  logout() {
    this.authService.logout();
  }
  //bootstrap model
  private readonly modalService = inject(BsModalService);
  bsModalRef?: BsModalRef;
  changePassword() {
    const initialState: ModalOptions = {
      class: 'modal-lg modal-dialog-centered',
    };
    this.bsModalRef = this.modalService.show(
      ChangePasswordComponent,
      initialState,
    );
  }
  ngOnInit(): void {
    this.getUserData();
  }
}
