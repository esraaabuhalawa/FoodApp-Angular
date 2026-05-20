import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Recipe } from 'src/app/shared/models/recipe';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  recipe!: Recipe
  assetUrl = environment.assestUrl
  constructor(public bsModalRef: BsModalRef) { }
  
  cancel(): void {
    this.bsModalRef.hide();
  }

  //image Error
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '../../../assets/images/placeholder-img.jpg';
  }
}
