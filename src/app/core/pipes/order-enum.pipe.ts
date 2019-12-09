import { Pipe, PipeTransform } from '@angular/core';
import { MatchDay } from 'src/app/views/schedule/models/match-days.enum';

@Pipe({
	name: 'orderEnum'
})
export class OrderEnumPipe implements PipeTransform {
	transform(data: any): any {
		return data.sort((a, b) => {
			if (typeof parseInt(MatchDay[a]) === 'number' && typeof parseInt(MatchDay[b]) === 'number') {
				return parseInt(MatchDay[a]) - parseInt(MatchDay[b]);
			} else {
				console.error('[OrderEnumPipe]: Unable to sort the passed in enum');
				return [];
			}
		});
	}
}
