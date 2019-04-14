import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { TeamSignupFormComponent } from './about/components/team-signup-form/team-signup-form.component';
import { MerchandiseComponent } from './merchandise/merchandise.component';
import { GalleryComponent } from './gallery/gallery.component';


const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent,
    data: { animation: 'AboutPage' }
  },
  {
    path: 'team-signup',
    component: TeamSignupFormComponent,
    data: { animation: 'TeamSignUpPage'}
  },
  {
    path: 'merchandise',
    component: MerchandiseComponent,
    data: { animation: 'MerchandisePage' }
  },
  {
    path: 'gallery',
    component: GalleryComponent,
    data: { animation: 'GalleryPage' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticRoutingModule {}
