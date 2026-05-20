import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrentUser } from 'src/app/features/auth/models/currentUser';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { roleEnum } from 'src/app/core/enums/role.enum';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [RouterLink, CommonModule]
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  currentUser!: CurrentUser;

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

  isSuperAdmin(): boolean {
    return this.authService.getRole() === roleEnum.SuperAdmin ? true : false;
  }

  isUser(): boolean {
    return this.authService.getRole() === roleEnum.SystemUser ? true : false;
  }

  recipeLink(): string[] {
    if (this.isSuperAdmin()) {
      return ['/dashboard/admin/recipes'];
    } else {
      return ['/dashboard/userPortal/user-recipes'];
    }
  }
  ngOnInit(): void {
    this.getUserData();
  }
}
