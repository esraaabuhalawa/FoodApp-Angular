import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-file-drop',
  templateUrl: './file-drop.component.html',
  styleUrls: ['./file-drop.component.css'],
})
export class FileDropComponent {
  @Input() existingImage: string | null = null; // for edit mode
  @Input() maxFileSize: number = 5 * 1024 * 1024; // 5MB default
  @Input() accept: string = '.jpg,.jpeg,.png';
  @Input() isInvalid: boolean | undefined = false; // pass form control invalid+touched state
  @Input() label:string = 'Drop your image here'
  @Output() fileSelected = new EventEmitter<File>();
  @Output() fileRemoved = new EventEmitter<void>();

  imagePreview: string | null = null;

  constructor(private toastr: ToastrService) {}

  // ngOnInit(): void {
  //   //Show existing image in edit mode
  //   if (this.existingImage) {
  //     this.imagePreview = this.existingImage;
  //   }
  // }

  onFileDrop(files: NgxFileDropEntry[]): void {
    const droppedFile = files[0];
    if (!droppedFile?.fileEntry.isFile) return;

    const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
    fileEntry.file((file: File) => {
      if (file.size > this.maxFileSize) {
        this.toastr.error('Image size must not exceed 5 MB', 'Error');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);

      this.fileSelected.emit(file); // ← send File to parent
    });
  }

  removeImage(): void {
    this.imagePreview = null;
    this.fileRemoved.emit(); // ← tell parent image was removed
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    this.imagePreview = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Runs every time existingImage input changes
    if (changes['existingImage'] && changes['existingImage'].currentValue) {
      this.imagePreview = changes['existingImage'].currentValue;
    }
  }
}
