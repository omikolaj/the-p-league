import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SizeEnumToSizePipe } from './pipes/sizeEnumToSize/size-enum-to-size.pipe';
import { SharedModule } from '../shared/shared.module';
import { StoreImageViewPipe } from './pipes/store-image-view/store-image-view.pipe';
import { ClearElementValueDirective } from './directives/clear-element-value/clear-element-value.directive';


@NgModule({
  declarations: [SizeEnumToSizePipe, StoreImageViewPipe, ClearElementValueDirective],
  imports: [
    CommonModule,    
    SharedModule
  ],
  exports: [
    SizeEnumToSizePipe,
    StoreImageViewPipe,
    ClearElementValueDirective
  ]
})
export class CoreModule { }
