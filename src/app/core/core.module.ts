import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AllowSpacesDirective } from './directives/allow-space/allow-spaces.directive';
import { ClearElementValueDirective } from './directives/clear-element-value/clear-element-value.directive';
import { EnumToArrayPipe } from './pipes/enumToArray/enum-to-array.pipe';
import { LogPipe } from './pipes/log/log.pipe';
import { OrderEnumPipe } from './pipes/order-enum.pipe';
import { SizeEnumToSizePipe } from './pipes/sizeEnumToSize/size-enum-to-size.pipe';

@NgModule({
	declarations: [SizeEnumToSizePipe, ClearElementValueDirective, EnumToArrayPipe, AllowSpacesDirective, LogPipe, OrderEnumPipe],
	imports: [CommonModule, SharedModule],
	exports: [SizeEnumToSizePipe, ClearElementValueDirective, EnumToArrayPipe, AllowSpacesDirective, LogPipe, OrderEnumPipe]
})
export class CoreModule {}
