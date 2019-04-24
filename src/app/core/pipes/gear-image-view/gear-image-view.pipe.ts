import { Pipe, PipeTransform } from '@angular/core';
import { GearImage } from '../../models/gear-image.model';

@Pipe({
  name: 'gearImageView',
})
export class GearImageViewPipe implements PipeTransform {

  transform(gearImages: GearImage[]): GearImage[] {    
    let viewImagesArr: GearImage[] = [];    

    for (let index = 0; index < gearImages.length; index++) {
      let viewImage = Object.assign({}, gearImages[index]);
      viewImage.name = viewImage.name.slice(0, 27);
      viewImagesArr = [...viewImagesArr, viewImage];
    }
    return viewImagesArr;
  }

}
