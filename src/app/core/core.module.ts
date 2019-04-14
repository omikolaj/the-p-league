import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SizeEnumToSizePipe } from './pipes/sizeEnumToSize/size-enum-to-size.pipe';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [SizeEnumToSizePipe],
  imports: [
    CommonModule,    
    SharedModule
  ],
  exports: [
    SizeEnumToSizePipe
  ]
})
export class CoreModule { }
