import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { StaticRoutingModule } from './static.routing';
import { LayoutModule } from '@angular/cdk/layout';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TeamSignupFormComponent } from './about/components/team-signup-form/team-signup-form.component';
import { GalleryComponent } from './gallery/gallery.component';
import { MerchandiseListComponent } from './merchandise-list/merchandise-list.component';
import { MerchandiseItemComponent } from './merchandise-list/merchandise-item/merchandise-item.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [
    AboutComponent, 
    TeamSignupFormComponent, 
    GalleryComponent, 
    MerchandiseListComponent,
    MerchandiseItemComponent
  ],
  imports: [
    CommonModule,
    StaticRoutingModule,
    SharedModule,
    LayoutModule,
    CommonModule,    
    ReactiveFormsModule,
    CoreModule
  ]
})
export class StaticModule { }
