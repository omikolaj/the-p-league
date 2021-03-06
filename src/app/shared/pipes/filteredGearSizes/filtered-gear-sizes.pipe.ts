import { Pipe, PipeTransform } from '@angular/core';
import { GearSize } from 'src/app/core/models/merchandise/gear-size.model';

@Pipe({
	name: 'filteredGearSizes'
})
export class FilteredGearSizesPipe implements PipeTransform {
	transform(gearSizes: GearSize[]): any {
		return gearSizes.filter((gS) => gS.available);
	}
}
