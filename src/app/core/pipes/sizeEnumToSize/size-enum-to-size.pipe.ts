import { Pipe, PipeTransform } from '@angular/core';
import { Size } from '../../models/gear-item..model';
import { forEach } from '@angular/router/src/utils/collection';
import { map } from 'rxjs/operators';

const ALL: string = "ALL";
const NONE: string = "NONE";
const SIZENONE: string = "Coming Soon";

@Pipe({
  name: 'sizeEnumToSize'
})
export class SizeEnumToSizePipe implements PipeTransform {    
  transform(sizeData: Size[]): any {    
    let sizeArray = [];        
    if(sizeData.length > 1){      
      for (let index = 0; index < sizeData.length; index++) {
        let sorted = sizeData.sort((a, b) => {
          return a - b;
        })        
        sizeArray.push(Size[sizeData[index]]);        
      }
    }
    else{
      const size = Size[sizeData[0]];
      if(size === ALL){
        for(let size in Size){
          if(isNaN(Number(size)) && (size !== NONE && size !== ALL)){                                    
            sizeArray.push(size)
          }       
        } 
      }
      if(size === NONE){                  
        sizeArray.push(SIZENONE);
      }
      else if(size !== ALL){        
        sizeArray.push(size);  
      }
    }
    return sizeArray;    
  }

}
