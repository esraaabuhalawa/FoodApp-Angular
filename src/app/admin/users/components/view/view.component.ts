import { Component, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment.development';
import { User } from '../../services/model/user';
import { CurrentUser } from 'src/app/auth/models/currentUser';
import { roleEnum } from 'src/app/core/enums/role.enum';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  user!: User
  bsModalRef = inject(BsModalRef)
  assetUrl = environment.assestUrl

  cancel(): void {
    this.bsModalRef.hide();
  }
  currentUser!: CurrentUser;

  get isActive(): boolean {
    return this.user.email === this.currentUser.email;
  }

  userRole(){
    return this.user.group.name === roleEnum.SuperAdmin ? 'Admin' : 'User'
  }
  //image Error
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '../../../assets/images/user-placeholder.png';
  }

  ngOnInit() {
  }
}
