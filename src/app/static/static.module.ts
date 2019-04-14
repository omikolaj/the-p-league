import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { StaticRoutingModule } from './static.routing';
import { MatGridListModule, MatCardModule, MatMenuModule, MatIconModule, MatButtonModule, MatInputModule, MatSelectModule, MatRadioModule } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { SharedModule } from '../shared/shared.module';

import { ReactiveFormsModule } from '@angular/forms';
import { TeamSignupFormComponent } from './about/components/team-signup-form/team-signup-form.component';
import { MerchandiseComponent } from './merchandise/merchandise.component';
import { GalleryComponent } from './gallery/gallery.component';


@NgModule({
  declarations: [AboutComponent, TeamSignupFormComponent, MerchandiseComponent, GalleryComponent],
  imports: [
    CommonModule,
    StaticRoutingModule,
    SharedModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule
  ]
})
export class StaticModule { }
