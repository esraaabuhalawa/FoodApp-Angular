import { Component, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment.development';
import { User } from '../../services/model/user';
import { CurrentUser } from 'src/app/features/auth/models/currentUser';
import { roleEnum } from 'src/app/core/enums/role.enum';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  bsModalRef = inject(BsModalRef)
  user!: User
  assetUrl = environment.assestUrl
  currentUser!: CurrentUser;

  //Helper Functions
  get isActive(): boolean {
    return this.user.email === this.currentUser.email;
  }

  cancel(): void {
    this.bsModalRef.hide();
  }

  userRole() {
    return this.user.group.name === roleEnum.SuperAdmin ? 'Admin' : 'User'
  }

  //image Error
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '../../../assets/images/user-placeholder.png';
  }
}
