import { Pipe, PipeTransform } from '@angular/core';
import { GearSize, Size } from '../../models/merchandise/gear-size.model';

const ALL = 'ALL';
const NONE = 'NONE';
const SIZENONE = 'Coming Soon';

@Pipe({
  name: 'sizeEnumToSize'
})
export class SizeEnumToSizePipe implements PipeTransform {
  transform(sizeData: GearSize[]): any {
    const sizeArray = [];

    if (sizeData.length > 1) {
      for (let index = 0; index < sizeData.length; index++) {
        sizeArray.push(Size[sizeData[index].size]);
      }
    } else {
      const size = Size[sizeData[0].size];
      if (size === ALL) {
        for (const size in Size) {
          if (isNaN(Number(size)) && (size !== NONE && size !== ALL)) {
            sizeArray.push(size);
          }
        }
      }
      if (size === NONE) {
        sizeArray.push(SIZENONE);
      } else if (size !== ALL) {
        sizeArray.push(size);
      }
    }
    console.log('[PIPE]', sizeArray);
    return sizeArray;
  }
}
