import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
	name: 'fromUnix',
	pure: true
})
export class FromUnixPipe implements PipeTransform {
	transform(dateTime: string | number): any {
		if (typeof dateTime === 'number') {
			return moment.unix(dateTime);
		} else {
			return dateTime;
		}
	}
}
