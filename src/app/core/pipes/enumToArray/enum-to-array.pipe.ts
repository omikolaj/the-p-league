import { Pipe, PipeTransform } from '@angular/core';
import { Sport } from 'src/app/views/schedule/models/sport.enum';

@Pipe({
  name: 'enumToArray'
})
export class EnumToArrayPipe implements PipeTransform {

  transform(data: any): any {
    console.log("data", data);
    const keys = Object.keys(data);
    console.log("inside pipe");    
    return keys.slice(keys.length / 2).filter(name => name !== Sport[Sport.None]);
  }

}
