import { Component, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Recipe } from 'src/app/admin/recipes/models/recipe';
import { environment } from 'src/environments/environment.development';
import { FavoritService } from '../../../favorites/services/favorit.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  recipe!: Recipe
  constructor(public bsModalRef: BsModalRef) { }
  assetUrl = environment.assestUrl
   private readonly favoriteService = inject(FavoritService)
   private readonly toastr = inject(ToastrService);
   isLoading:boolean = false
  errorMessage: string = '';

    addToFavorite(id: number): void {
      this.isLoading = true
    this.favoriteService.addRecipeToFavorite(id).subscribe({
        next: (res) => {
          this.isLoading = false;
        this.bsModalRef.hide();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Something went wrong';
          this.toastr.error('Something went wrong' , '!Error');
        },
        complete:()=>{
           this.toastr.success(`${this.recipe.name} added to your favorites`, '!success');
          this.bsModalRef.onHidden?.emit({ updated: true });
        }
      });
    }

  cancel(): void {
    this.bsModalRef.hide();
  }

  //image Error
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '../../../assets/images/placeholder-img.jpg';
  }
}
