import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { StaticRoutingModule } from './static.routing';
import { LayoutModule } from '@angular/cdk/layout';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TeamSignupFormComponent } from './about/components/team-signup-form/team-signup-form.component';
import { CoreModule } from '../core/core.module';
import { GalleryGridListComponent } from './gallery/gallery-grid-list.component';
import { MerchandiseListComponent } from './merchandise/merchandise-list/merchandise-list.component';
import { MerchandiseItemComponent } from './merchandise/merchandise-list/merchandise-item/merchandise-item.component';
import { MerchandiseDialogContainerComponent } from './merchandise/merchandise-dialog-container/merchandise-dialog-container.component';
import { MerchandiseDialogComponent } from './merchandise/merchandise-dialog-container/merchandise-dialog/merchandise-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MerchandiseDialogService } from './merchandise/merchandise-dialog.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselComponent } from './merchandise/components/carousel/carousel.component';

@NgModule({
  declarations: [
    AboutComponent, 
    TeamSignupFormComponent, 
    GalleryGridListComponent, 
    MerchandiseListComponent,
    MerchandiseItemComponent,
    MerchandiseDialogContainerComponent,
    MerchandiseDialogComponent,
    CarouselComponent    
  ],
  entryComponents: [MerchandiseDialogComponent],
  imports: [
    CommonModule,
    StaticRoutingModule,
    SharedModule,
    LayoutModule,
    CommonModule,    
    ReactiveFormsModule,
    CoreModule,
    NgbModule
  ], 
  providers: [
    MerchandiseDialogService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} }
  ]
})
export class StaticModule { }
