import { Pipe, PipeTransform } from '@angular/core';
import { GearSize, Size } from '../../models/gear-size.model';

const ALL: string = "ALL";
const NONE: string = "NONE";
const SIZENONE: string = "Coming Soon";

@Pipe({
  name: 'sizeEnumToSize'
})
export class SizeEnumToSizePipe implements PipeTransform {    
  transform(sizeData: GearSize[]): any {    
    let sizeArray = [];        

    if(sizeData.length > 1){      
      for (let index = 0; index < sizeData.length; index++) {
        sizeArray.push(Size[sizeData[index].size]);        
      }
    }
    else{
      const size = Size[sizeData[0].size];
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
    console.log('[PIPE]', sizeArray)
    return sizeArray;    
  }  

}
