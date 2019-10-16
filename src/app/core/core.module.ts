import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SizeEnumToSizePipe } from './pipes/sizeEnumToSize/size-enum-to-size.pipe';
import { SharedModule } from '../shared/shared.module';
import { ClearElementValueDirective } from './directives/clear-element-value/clear-element-value.directive';
import { FilteredGearSizesPipe } from './pipes/filteredGearSizes/filtered-gear-sizes.pipe';
import { EnumToArrayPipe } from './pipes/enumToArray/enum-to-array.pipe';


@NgModule({
  declarations: [SizeEnumToSizePipe, ClearElementValueDirective, EnumToArrayPipe],
  imports: [CommonModule, SharedModule],
  exports: [SizeEnumToSizePipe, ClearElementValueDirective, EnumToArrayPipe]
})
export class CoreModule {}
