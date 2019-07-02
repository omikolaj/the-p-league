import { Pipe, PipeTransform } from '@angular/core';
import { GearImage } from '../../models/merchandise/gear-image.model';

@Pipe({
  name: 'gearImageView',
  pure: false
})
export class GearImageViewPipe implements PipeTransform {

  transform(gearImages: GearImage[]): GearImage[] {
    for (let index = 0; index < gearImages.length; index++) {      
      let gearImage = gearImages[index];
      gearImage.name = gearImage.name.slice(0, 27);
      gearImages.splice(index, 1, gearImage)
    }
    return gearImages;
  }

}
