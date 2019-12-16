import { Pipe, PipeTransform } from '@angular/core';
import { Sport } from 'src/app/core/models/schedule/sport.enum';

@Pipe({
	name: 'enumToArray'
})
export class EnumToArrayPipe implements PipeTransform {
	transform(data: any): any {
		const keys = Object.keys(data);
		return keys.slice(keys.length / 2).filter((name) => name !== Sport[Sport.None]);
		// return enumKeysToArray(data);
	}
}
