import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { StaticRoutingModule } from './static.routing';


@NgModule({
  declarations: [AboutComponent],
  imports: [
    CommonModule,
    StaticRoutingModule
  ]
})
export class StaticModule { }
