import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileUtilServiceService {

  constructor() { }
  async imageUrlToFile(
    imageUrl: string,
    fileName: string
  ): Promise<File> {

    const response = await fetch(imageUrl);

    const blob = await response.blob();

    return new File([blob], fileName, {
      type: blob.type
    });
  }
}
