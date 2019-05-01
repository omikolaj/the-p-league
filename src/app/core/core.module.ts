import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SizeEnumToSizePipe } from './pipes/sizeEnumToSize/size-enum-to-size.pipe';
import { SharedModule } from '../shared/shared.module';
import { GearImageViewPipe } from './pipes/gear-image-view/gear-image-view.pipe';
import { ClearElementValueDirective } from './directives/clear-element-value/clear-element-value.directive';

@NgModule({
  declarations: [
    SizeEnumToSizePipe, 
    GearImageViewPipe, 
    ClearElementValueDirective
  ],
  imports: [
    CommonModule,    
    SharedModule
  ],
  exports: [
    SizeEnumToSizePipe,
    GearImageViewPipe,
    ClearElementValueDirective
  ]
})
export class CoreModule { }
