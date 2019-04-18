import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SizeEnumToSizePipe } from './pipes/sizeEnumToSize/size-enum-to-size.pipe';
import { SharedModule } from '../shared/shared.module';
import { StoreImageViewPipe } from './pipes/store-image-view/store-image-view.pipe';

@NgModule({
  declarations: [SizeEnumToSizePipe, StoreImageViewPipe],
  imports: [
    CommonModule,    
    SharedModule
  ],
  exports: [
    SizeEnumToSizePipe,
    StoreImageViewPipe
  ]
})
export class CoreModule { }
