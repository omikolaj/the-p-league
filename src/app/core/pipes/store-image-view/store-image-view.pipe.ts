import { Pipe, PipeTransform } from '@angular/core';
import { StoreImage } from '../../models/store-image.model';

@Pipe({
  name: 'storeImageView'
})
export class StoreImageViewPipe implements PipeTransform {

  transform(storeImages: StoreImage[]): StoreImage[] {   
    let viewImagesArr: StoreImage[] = [];    

    for (let index = 0; index < storeImages.length; index++) {
      let viewImage = Object.assign({}, storeImages[index]);
      viewImage.name = viewImage.name = viewImage.name.slice(0, 4) + viewImage.ID.slice(0, 4);
      viewImagesArr = [...viewImagesArr, viewImage];
    }
    return viewImagesArr;
  }

}
