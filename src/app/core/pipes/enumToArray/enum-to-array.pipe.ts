import { Pipe, PipeTransform } from '@angular/core';
import { enumKeysToArray } from '../../../shared/helpers/enum-keys-to-array';

@Pipe({
	name: 'enumToArray'
})
export class EnumToArrayPipe implements PipeTransform {
	transform(data: any): any {
		// const keys = Object.keys(data);
		// return keys.slice(keys.length / 2).filter((name) => name !== Sport[Sport.None]);
		return enumKeysToArray(data);
	}
}
